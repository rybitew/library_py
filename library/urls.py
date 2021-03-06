"""library URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers

from quickstart import views, bookViews

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
urlpatterns = [
    path(r'admin/', admin.site.urls),
    # path('accounts/profile/', views.redirect_to_main),
    # path('', views.redirect_to_main),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url('api/book/all', bookViews.get_all),
    url('api/book/manage', bookViews.book_mgmt),
    url('api/book', bookViews.book_get),
    url('api/account/login', views.login),
    url('api/account/register', views.register),
    url('api/location/all', views.library_location),
    url('api/location', views.add_library),
]

