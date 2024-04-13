import pytz
import json
import uuid
import random
import string
from datetime import datetime
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from users.permissions import HasSessionActive
# Models & Serializers
from .models import Note, ShareExternal
from .serializers import NoteListSerializer, ShareExternalSerializer
# Session
from users.session import getUser
from backend.utils import errorResponse, successResponse, hashThis
from notes.utils import encrypt_note, decrypt_note, InvalidKeyException


# Create a note
# -----------------------------------------------
@api_view(['POST'])
@permission_classes([HasSessionActive])
def createNote(request):
    try:
        # -- user data & hash password
        dateStamp = datetime.now(pytz.utc)
        note = Note.objects.create(
            id=uuid.uuid4(),
            title=request.data['title'],
            content=encrypt_note(request.data['content']),
            user=getUser(request),
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
@permission_classes([HasSessionActive])
def getUserNotes(request):
    try:
        notes = NoteListSerializer(Note.objects.filter(
            user=getUser(request)).order_by('updated'), many=True)
        return Response(data=successResponse(notes.data), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("Could not find any notes.", "N0411"), status=status.HTTP_404_NOT_FOUND)


# Read, update, delete a note
# -----------------------------------------------
@api_view(['GET', 'DELETE', 'PUT', 'POST'])
@permission_classes([HasSessionActive])
def noteOps(request, noteid):
    if request.method == 'GET':
        return readNote(request, noteid)
    elif request.method == 'PUT':
        return updateNoteContent(request, noteid)
    elif request.method == 'DELETE':
        return deleteNote(request, noteid)
    return Response(errorResponse("Cannot perform note action.", "N0412"), status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Read
def readNote(request, noteid):
    try:
        note = Note.objects.get(id=noteid, user=getUser(request))
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
    try:
        Note.objects.get(id=noteid, user=getUser(request)).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.", "N0407"), status=status.HTTP_404_NOT_FOUND)


# Update
def updateNoteContent(request, noteid):
    try:
        note = Note.objects.get(id=noteid, user=getUser(request))
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
@permission_classes([HasSessionActive])
def updateNoteTitle(request, noteid):
    try:
        note = Note.objects.get(id=noteid, user=getUser(request))
        note.title = request.data['title']
        note.save()

        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.", "N0405"), status=status.HTTP_400_BAD_REQUEST)


# Share a note via unique URL
# -----------------------------------------------
# Create a URL
@api_view(['POST'])
@permission_classes([HasSessionActive])
def createNoteShareLink(request, noteid):
    try:
        note = Note.objects.select_related('user').get(id=noteid)
        note_owner = note.user
        # Check if the user requesting is the owner
        if getUser(request) == note_owner:
            rid = ''.join(random.choice(string.ascii_letters+"0123456789$")
                          for m in range(6))
            active = request.data['active'] if type(
                request.data['active']) is bool else True
            title = request.data['title']
            anon = request.data['anonymous'] if type(
                request.data['anonymous']) is bool else True
            created = datetime.now(pytz.utc)
            dbid = uuid.uuid4()
            isPassword = 'password' in request.data and request.data['password'] is not None and len(
                request.data['password']) > 1
            row = ShareExternal(
                id=dbid,
                title=title,
                passkey=hashThis(rid),
                password=hashThis(
                    request.data['password']) if isPassword else "",
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
                isPasswordProtected=isPassword,
                id=dbid,
                created=created
            )
            return Response(data=successResponse(data), status=status.HTTP_201_CREATED)
    except Note.DoesNotExist:
        return Response(data=errorResponse("The request could not be processed.", "N1012"), status=status.HTTP_400_BAD_REQUEST)

    return Response(data=errorResponse("The request is invalid.", "N1001"), status=status.HTTP_400_BAD_REQUEST)


# Read the note
@api_view(['POST'])
def readNoteViaShareLink(request, permkey):
    try:
        query = ShareExternal.objects.select_related('note', 'user').get(
            passkey=hashThis(permkey), active=1)

        # Password is required
        if len(query.password) > 0 and ('password' not in request.data or len(request.data['password']) < 1):
            return Response(data=errorResponse("This link is password protected.", "N1401"), status=status.HTTP_401_UNAUTHORIZED)

        # Check password
        if len(query.password) > 0 and query.password != hashThis(request.data['password']):
            return Response(data=errorResponse("Incorrect Password!", "N1402"), status=status.HTTP_401_UNAUTHORIZED)

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
@permission_classes([HasSessionActive])
def getNoteShareLinks(request, noteid):
    links = ShareExternal.objects.filter(note=noteid, user=getUser(request)).values(
        'id', 'anonymous', 'created', 'title', 'active', 'password').order_by('-created')

    result = []

    for link in links:
        result.append({**ShareExternalSerializer(link).data,
                      'isPasswordProtected': True if len(link['password']) > 0 else False})

    return Response(data=successResponse(result), status=status.HTTP_200_OK)


# Disable a share link
@api_view(['PUT'])
@permission_classes([HasSessionActive])
def disableNoteShareLink(request):
    try:
        query = ShareExternal.objects.get(
            id=request.data['id'], user=getUser(request))
        query.active = False
        query.save()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except ShareExternal.DoesNotExist:
        return Response(data=errorResponse("This link does not exist.", "N1411"), status=status.HTTP_404_NOT_FOUND)
