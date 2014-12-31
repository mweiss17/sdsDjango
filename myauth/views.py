from django.shortcuts import render
from django.core.urlresolvers import reverse
from django.views.generic.edit import FormView
from django.contrib.auth import login
from myauth.forms import LoginForm
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from myauth.forms import *
from sds.models import *
from django.contrib.auth import get_user_model
from django.contrib import messages
from django.contrib import auth
import logging, json, pprint, datetime, time, hashlib,random,sys


def addloginform(context):
    loginform = LoginForm()
    loginform.fields['login'].widget.attrs['class'] = "submit-track user-login"
    loginform.fields['login'].widget.attrs['placeholder'] = "Disco-Name"
    loginform.fields['password'].widget.attrs['class'] = "submit-track user-login"
    loginform.fields['password'].widget.attrs['placeholder'] = "Password"
    context.update({'loginform':loginform})
    return

def forgotpassword(request):
	cities = city.objects.filter()
	context = {'cities':cities}
	addloginform(context)
	ufpr = UserForgotPasswordForm()
	if request.method == 'POST':
		ufpr = UserForgotPasswordForm(request.POST)
		context.update({'ufpr':ufpr})
		if ufpr.is_valid():
			User = get_user_model()
			user = User.objects.filter(email=request.POST['email'])
			user.backend = 'django.contrib.auth.backends.ModelBackend'
			if user:
				ufpr.save(from_email='Martin@SilentDiscoSquad.com', email_template_name='myauth/password_reset_email.html')
				context.update({'success':"success"})
				return render(request, 'forgotpassword.html', context)
			else:
				messages.error(request, 'We couldn\'t find any accounts with that email. Give it another shot?')
				return render(request, 'forgotpassword.html', context)
	context.update({'ufpr':ufpr})
	return render(request, 'forgotpassword.html', context)


def loginView(request):
	User = get_user_model()
	name = request.POST['login']
	password = request.POST['password']
	users = User.objects.filter(Q(username=name)|Q(email=name))
	context = {}
	for user in users:
		if user.is_active and user.check_password(password):
			user.backend = 'django.contrib.auth.backends.ModelBackend'
			auth.login(request, user)
			return HttpResponseRedirect(request.META.get('HTTP_REFERER'), context)
	messages.error(request, 'Incorrect username or password, try again.')
	return HttpResponseRedirect(request.META.get('HTTP_REFERER')+"#login", context)