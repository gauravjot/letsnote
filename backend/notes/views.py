import pytz, json, uuid
import hashlib
from datetime import datetime
from django.shortcuts import render
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Note, ShareExternal
from .serializers import NoteSerializer, NoteListSerializer, ShareExternalSerializer
from users.models import User
# Session
from users.session import getUserID
from backend.utils import errorResponse, successResponse, hashThis

# Create a note
# -----------------------------------------------
@api_view(['POST'])
def createNote(request):
    user = getUserID(request)
    # -- user data & hash password
    dateStamp = datetime.now(pytz.utc)

    noteSerializer = NoteSerializer(data=dict(
        id = uuid.uuid4(),
        title = request.data['title'],
        content = request.data['content'],
        user = user,
        created = dateStamp,
        updated = dateStamp
    ))
    
    # -- check if data is without bad actors
    if noteSerializer.is_valid():
        noteSerializer.save()
        
        return Response(data=noteSerializer.data,status=status.HTTP_201_CREATED)
    else:
        return Response(data=noteSerializer.errors,status=status.HTTP_400_BAD_REQUEST)

# Get all notes
# -----------------------------------------------
@api_view(['GET'])
def myNotes(request):
    user = getUserID(request)
    
    try:
        return Response(data=NoteListSerializer(Note.objects.filter(user=user).values('id','user','created','updated','title').order_by('updated'), many=True).data, status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("Could not find any notes.","N0411"), status=status.HTTP_404_NOT_FOUND)


# Read, update, delete a note
# -----------------------------------------------
@api_view(['GET','DELETE','PUT','POST'])
def noteOps(request, noteid):
    if request.method == 'GET':
        return readNote(request, noteid)
    elif request.method == 'PUT':
        return updateNote(request, noteid)
    elif request.method == 'DELETE':
        return deleteNote(request, noteid)
    return Response(errorResponse("Cannot perform note action.","N0412"),status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Read
def readNote(request, noteid):
    user = getUserID(request)
    
    try:
        return Response(data=NoteSerializer(Note.objects.get(id=noteid, user=user)).data, status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.","N0404"), status=status.HTTP_404_NOT_FOUND)

# Delete
def deleteNote(request, noteid):
    user = getUserID(request)
    
    try:
        Note.objects.get(id=noteid, user=user).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.","N0407"), status=status.HTTP_404_NOT_FOUND)

# Update
def updateNote(request, noteid):
    user = getUserID(request)   
    try:
        note = Note.objects.get(id=noteid, user=user)
        note.title = request.data['title']
        note.content = request.data['content']
        note.updated = datetime.now(pytz.utc)
        note.save()

        return Response(data=NoteSerializer(note).data,status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.","N0403"),status=status.HTTP_400_BAD_REQUEST)
    
# Share a note via unique URL
# -----------------------------------------------
# Create a URL
@api_view(['POST'])
def createNoteShareExternal(request, noteid):
    user = getUserID(request)
    
    # Check if the user requesting is the owner
    # try:
    if user == Note.objects.get(id=noteid).user: 
        rid = uuid.uuid4()
        expire = request.data['expire'] if type(request.data['expire']) is int else 0
        title = request.data['title']
        anon = request.data['anonymous'] if type(request.data['anonymous']) is bool else True
        created = datetime.now(pytz.utc)
        dbid = uuid.uuid4()
        row = ShareExternal(
            id = dbid,
            title = title,
            key = hashThis(rid),
            noteid = noteid,
            expire = expire,
            creator = user,
            created = created,
            anonymous = anon
        )
        row.save()
        
        return Response(data=dict(title=title, urlkey=rid, expire=expire, anonymous=anon, id=dbid, created=created), status=status.HTTP_201_CREATED)
    # except:
    #     return Response(data=errorResponse("The request could not be processed.","N1012"), status=status.HTTP_400_BAD_REQUEST)
        
    return Response(data=errorResponse("The request is invalid.","N1001"), status=status.HTTP_400_BAD_REQUEST)
    
# Read the note
@api_view(['GET'])
def readNoteShareExternal(request, permkey):
    try:
        noteShareExternal = ShareExternal.objects.get(key=hashThis(permkey))
        note = Note.objects.get(id=noteShareExternal.noteid)
        
        # We keep person who externally shared the note anonymous
        response = dict(
            noteTitle = note.title,
            noteContent = note.content,
            noteCreated = note.created,
            noteUpdated = note.updated,
            noteSharedOn = noteShareExternal.created,
            noteExpiry = noteShareExternal.expire
        )
        # If person expicitly asked not to be anonymous
        if noteShareExternal.anonymous is False:
            user = User.objects.get(id=noteShareExternal.creator)
            response['noteSharedBy'] = user.full_name
            response['noteSharedByUID'] = user.id
        
        return Response(data=response, status=status.HTTP_200_OK)
    except (ShareExternal.DoesNotExist, Note.DoesNotExist):
        return Response(data=errorResponse("This note does not exist.","N1404"), status=status.HTTP_404_NOT_FOUND)
    
# Read all share links for the note
@api_view(['GET'])
def readAllLinksNoteShareExt(request, noteid):
    user = getUserID(request)
    links = ShareExternalSerializer(ShareExternal.objects.filter(noteid=noteid,creator=user).values('id','anonymous','created','title').order_by('created'), many=True).data
    return Response(data=links, status=status.HTTP_200_OK)
    # except ShareExternal.DoesNotExist:
    #     return Response(data=errorResponse("No share links for this note yet.", "N1410"), status=status.HTTP_404_NOT_FOUND)