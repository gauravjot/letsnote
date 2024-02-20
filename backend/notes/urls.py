from django.urls import path
from .views import createNote, myNotes, noteOps, createNoteShareExternal, readNoteShareExternal, readAllLinksNoteShareExt, editNoteTitle, disableShareNoteLink

urlpatterns = [
    path('api/note/all/', myNotes),
    path('api/note/create/', createNote),
    path('api/note/<noteid>/', noteOps),
    path('api/note/share/<noteid>/', createNoteShareExternal),
    path('api/note/share/links/disable/', disableShareNoteLink),
    path('api/note/share/links/<noteid>/', readAllLinksNoteShareExt),
    path('api/note/shared/<permkey>/', readNoteShareExternal),
    path('api/note/<noteid>/edit/title/', editNoteTitle),
]
