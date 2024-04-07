import pytz
from datetime import datetime, timedelta
from django.http import JsonResponse
from backend.utils import errorResponse, hashThis
from backend.settings import NON_AUTH_URLS
from .models import Session


class AuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.

    def __call__(self, request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = self.get_response(request)

        # Code to be executed for each request/response after
        # the view is called.

        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # Check if URL is a public URL
        if request.path in NON_AUTH_URLS:
            return None

        # Get the user from the request
        session = self.getActiveSession(request)
        if type(session) is JsonResponse:
            # If the user is not logged in, return the response
            return session
        # Attach the session to the request
        request.active_session = session
        return None

    def getActiveSession(self, request):
        # Check if auth token is present in cookie
        try:
            token = request.COOKIES['auth_ln']
            if len(token) < 48:
                raise KeyError
        except Exception as e:
            return self.unauthorized()
        # Check if token is present in database and is valid
        try:
            session = Session.objects.select_related(
                'user').get(token=hashThis(token))
            # Check if session is valid
            if not session.valid:
                return self.unauthorized()
            # Check if session is expired
            gap = datetime.now(tz=pytz.utc) - session.created
            if gap > timedelta(minutes=session.expire):
                session.valid = False
                session.save()
                return self.unauthorized()
            # Return valid token
            return session
        except Session.DoesNotExist:
            return self.unauthorized()

    def unauthorized(self):
        return JsonResponse(errorResponse("Unauthorized.", "A0099"), status=401)
