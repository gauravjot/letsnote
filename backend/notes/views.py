import pytz
import json
import uuid
from datetime import datetime
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Note, ShareExternal
from .serializers import NoteListSerializer, ShareExternalSerializer
# Session
from users.session import getUserID
from backend.utils import errorResponse, successResponse, hashThis
from notes.utils import encrypt_note, decrypt_note, InvalidKeyException


# Create a note
# -----------------------------------------------
@api_view(['POST'])
def createNote(request):
    user = getUserID(request)

    try:
        # -- user data & hash password
        dateStamp = datetime.now(pytz.utc)
        note = Note.objects.create(
            id=uuid.uuid4(),
            title=request.data['title'],
            content=encrypt_note(request.data['content']),
            user=user,
            created=dateStamp,
            updated=dateStamp
        )
        note.save()

        return Response(data=successResponse({"content": json.dumps(request.data['content']), **NoteListSerializer(note).data, }), status=status.HTTP_201_CREATED)
    except Note.DoesNotExist:
        return Response(data=errorResponse("Unable to create note.", "N0400"), status=status.HTTP_400_BAD_REQUEST)


# Get all notes
# -----------------------------------------------
@api_view(['GET'])
def myNotes(request):
    user = getUserID(request)

    try:
        notes = NoteListSerializer(Note.objects.filter(
            user=user).order_by('updated'), many=True)
        return Response(data=successResponse(notes.data), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("Could not find any notes.", "N0411"), status=status.HTTP_404_NOT_FOUND)


# Read, update, delete a note
# -----------------------------------------------
@api_view(['GET', 'DELETE', 'PUT', 'POST'])
def noteOps(request, noteid):
    if request.method == 'GET':
        return readNote(request, noteid)
    elif request.method == 'PUT':
        return updateNote(request, noteid)
    elif request.method == 'DELETE':
        return deleteNote(request, noteid)
    return Response(errorResponse("Cannot perform note action.", "N0412"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Read
def readNote(request, noteid):
    user = getUserID(request)

    try:
        note = Note.objects.get(id=noteid, user=user)
        # Decrypt the note
        if note.content:
            content = decrypt_note(note.content)
        else:
            content = ""
        data = NoteListSerializer(note).data
        data['content'] = content
        return Response(data=successResponse(data), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.", "N0404"), status=status.HTTP_404_NOT_FOUND)
    except InvalidKeyException:
        return Response(data=errorResponse("This note cannot be decrypted.", "N0549"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Delete
def deleteNote(request, noteid):
    user = getUserID(request)

    try:
        Note.objects.get(id=noteid, user=user).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.", "N0407"), status=status.HTTP_404_NOT_FOUND)


# Update
def updateNote(request, noteid):
    user = getUserID(request)
    try:
        note = Note.objects.get(id=noteid, user=user)
        note.title = request.data['title']
        note.content = encrypt_note(request.data['content'])
        note.updated = datetime.now(pytz.utc)
        note.save()

        data = NoteListSerializer(note).data
        # We send json string of the content
        data['content'] = json.dumps(request.data['content'])

        return Response(data=successResponse(data), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.", "N0403"), status=status.HTTP_400_BAD_REQUEST)


# Update
@api_view(['PUT'])
def editNoteTitle(request, noteid):
    user = getUserID(request)
    try:
        note = Note.objects.get(id=noteid, user=user)
        note.title = request.data['title']
        note.save()

        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.", "N0405"), status=status.HTTP_400_BAD_REQUEST)


# Share a note via unique URL
# -----------------------------------------------
# Create a URL
@api_view(['POST'])
def createNoteShareExternal(request, noteid):
    user = getUserID(request)

    # Check if the user requesting is the owner
    # try:
    note = Note.objects.select_related('user').get(id=noteid)
    note_owner = note.user
    if user == note_owner:
        rid = uuid.uuid4()
        active = request.data['active'] if type(
            request.data['active']) is bool else True
        title = request.data['title']
        anon = request.data['anonymous'] if type(
            request.data['anonymous']) is bool else True
        created = datetime.now(pytz.utc)
        dbid = uuid.uuid4()
        row = ShareExternal(
            id=dbid,
            title=title,
            passkey=hashThis(rid),
            note=note,
            active=active,
            user=note_owner,
            created=created,
            anonymous=anon
        )
        row.save()

        data = dict(
            title=title,
            urlkey=rid,
            active=active,
            anonymous=anon,
            id=dbid,
            created=created
        )
        return Response(data=successResponse(data), status=status.HTTP_201_CREATED)
    # except:
    #     return Response(data=errorResponse("The request could not be processed.","N1012"), status=status.HTTP_400_BAD_REQUEST)

    return Response(data=errorResponse("The request is invalid.", "N1001"), status=status.HTTP_400_BAD_REQUEST)


# Read the note
@api_view(['GET'])
def readNoteShareExternal(request, nui, permkey):
    try:
        query = ShareExternal.objects.select_related('note', 'user').get(
            passkey=hashThis(permkey), note__id__startswith=nui, active=1)

        # We keep person who externally shared the note anonymous
        response = dict(
            noteTitle=query.note.title,
            noteContent=decrypt_note(query.note.content),
            noteCreated=query.note.created,
            noteUpdated=query.note.updated,
            noteSharedOn=query.created,
        )
        # If person expicitly asked not to be anonymous
        if query.anonymous is False:
            response['noteSharedBy'] = query.user.name
            response['noteSharedByUID'] = query.user.id

        return Response(data=successResponse(response), status=status.HTTP_200_OK)
    except (ShareExternal.DoesNotExist, Note.DoesNotExist):
        return Response(data=errorResponse("This note does not exist.", "N1404"), status=status.HTTP_404_NOT_FOUND)


# Read all share links for the note
@api_view(['GET'])
def readAllLinksNoteShareExt(request, noteid):
    user = getUserID(request)
    links = ShareExternalSerializer(ShareExternal.objects.filter(note=noteid, user=user).values(
        'id', 'anonymous', 'created', 'title', 'active').order_by('-created'), many=True).data
    return Response(data=successResponse(links), status=status.HTTP_200_OK)
    # except ShareExternal.DoesNotExist:
    #     return Response(data=errorResponse("No share links for this note yet.", "N1410"), status=status.HTTP_404_NOT_FOUND)
