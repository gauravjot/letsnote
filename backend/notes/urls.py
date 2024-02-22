from django.urls import path
from .views import createNote, getUserNotes, noteOps, createNoteShareLink, readNoteViaShareLink, getNoteShareLinks, updateNoteTitle, disableNoteShareLink

urlpatterns = [
    path('api/note/all/', getUserNotes),
    path('api/note/create/', createNote),
    path('api/note/<noteid>/', noteOps),
    path('api/note/share/<noteid>/', createNoteShareLink),
    path('api/note/share/links/disable/', disableNoteShareLink),
    path('api/note/share/links/<noteid>/', getNoteShareLinks),
    path('api/note/shared/<permkey>/', readNoteViaShareLink),
    path('api/note/<noteid>/edit/title/', updateNoteTitle),
]
