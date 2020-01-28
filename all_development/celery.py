from __future__ import absolute_import,  unicode_literals
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'all_development.settings')

app = Celery('proj')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

from celery.schedules import crontab
app.conf.beat_schedule = {
	'add-evry-minute-contrab': {
		'task'		: 'multiply_two_numbers',
		'schedule'	: crontab(),
		'args'		: (16, 16),
	},

	'add-every-5-seconds':{
		'task' 		: 'multiply_two_numbers',
		'schedule'	: 5.0,
		'args'		: (16, 16),
	},

	# 'add-every-30-seconds': {
	# 	'tasks'		: 'tasks.add',
	# 	'schedule'	: 30.0,
	# 	'args'		: (16, 16),		
	# },
	
}

@app.task(bind=True)
def debug_task(self):
	print('Request: {0!r}'.format(self.request))