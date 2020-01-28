from __future__ import absolute_import, unicode_literals
import subprocess
import random
from celery.decorators import task

@task(name="sum_two_numbers")
def add(x, y):
	return x + y

@task(name="multiply_two_numbers")
def mul(x, y):
	total = x * (y * random.randint(3, 100))
	return total

@task(name="sum_list_numbers")
def xsum(numbers):
	return sum(numbers)

@task(name="find files")
def all_ls():
	return subprocess.run('snakemake')
