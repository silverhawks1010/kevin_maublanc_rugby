# Generated by Django 4.2.5 on 2023-09-26 12:51

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start', models.DateTimeField()),
            ],
        ),
        migrations.CreateModel(
            name='Newsletter',
            fields=[
                ('email', models.EmailField(max_length=100, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('consent', models.BooleanField()),
            ],
        ),
        migrations.CreateModel(
            name='Stadium',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('location', models.CharField(max_length=100)),
                ('latitude', models.DecimalField(decimal_places=6, max_digits=9)),
                ('longitude', models.DecimalField(decimal_places=6, max_digits=9)),
            ],
        ),
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(max_length=100)),
                ('country_alpha2', models.CharField(max_length=2)),
                ('nickname', models.CharField(max_length=100)),
                ('color_first', models.CharField(max_length=6)),
                ('color_second', models.CharField(max_length=6)),
            ],
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.CharField(default=uuid.uuid4, max_length=36, primary_key=True, serialize=False)),
                ('category', models.CharField(choices=[('Silver', 'Categorie Silver'), ('Gold', 'Categorie Gold'), ('Platinum', 'Categorie Platinum')], max_length=10)),
                ('seat', models.TextField()),
                ('price', models.IntegerField()),
                ('currency', models.CharField(choices=[('EUR', 'Euro'), ('JPY', 'Japan Yen'), ('NZD', 'New Zealand Dollar')], max_length=3)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='mainapp.event')),
            ],
        ),
        migrations.AddField(
            model_name='event',
            name='stadium',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='mainapp.stadium'),
        ),
        migrations.AddField(
            model_name='event',
            name='team_away',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='events_as_away', to='mainapp.team'),
        ),
        migrations.AddField(
            model_name='event',
            name='team_home',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='events_as_home', to='mainapp.team'),
        ),
    ]
