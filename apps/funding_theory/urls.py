from django.urls import path
from . import views

# app_name = 'funding_theory'
urlpatterns = [
    path('', views.index_view, name='index_view'),    
    path('cactus_plot', views.cactus_plot_view, name='cactus_plot_view'),
    path('csv2json', views.csv2json_view, name='csv2json_view'),
    path('pdf', views.pdf_view, name='pdf_view'),
]
