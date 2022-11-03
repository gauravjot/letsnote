import pytz, json, uuid
from datetime import datetime
from django.shortcuts import render
# RestFramework
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
# Models & Serializers
from .models import Note
from .serializers import NoteSerializer, NoteListSerializer
# Session
from users.session import getUserID
from backend.utils import errorResponse, successResponse

# Sign Up function
# -----------------------------------------------
@api_view(['POST'])
def createNote(request):
    user = getUserID(request)
    # -- user data & hash password
    dateStamp = datetime.now(pytz.utc)

    noteSerializer = NoteSerializer(data=dict(
        id = uuid.uuid4(),
        title = request.data['title'],
        content = "",
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

@api_view(['GET'])
def readNote(noteid, request):
    user = getUserID(request)
    
    try:
        return Response(data=NoteSerializer(Note.objects.get(id=noteid, user=user)).data, status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.","N0404"), status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def myNotes(request):
    user = getUserID(request)
    
    try:
        return Response(data=NoteListSerializer(Note.objects.filter(user=user).values('id','user','created','updated','title'), many=True).data, status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("Could not find any notes.","N0411"), status=status.HTTP_404_NOT_FOUND)

# Log Out function, requires token
# -----------------------------------------------
@api_view(['DELETE'])
def deleteNote(noteid, request):
    user = getUserID(request)
    
    try:
        Note.objects.get(id=noteid, user=user).delete()
        return Response(data=successResponse(), status=status.HTTP_200_OK)
    except Note.DoesNotExist:
        return Response(data=errorResponse("This note does not exist.","N0407"), status=status.HTTP_404_NOT_FOUND)

# Verify Email, requires email verification token
# -----------------------------------------------
@api_view(['POST'])
def updateNote(request, noteid):
    user = getUserID(request)   
    try:
        note = Note.objects.get(id=noteid, user=user)
        note.title = request.data['title']
        note.content = request.data['content']
        note.updated = datetime.now(pytz.utc)
        note.save()

        return Response(data=NoteSerializer(note).data,status=status.HTTP_200_OK)
    except (Note.DoesNotExist) as err:
        return Response(data=errorResponse("This note does not exist.","N0403"),status=status.HTTP_400_BAD_REQUEST)