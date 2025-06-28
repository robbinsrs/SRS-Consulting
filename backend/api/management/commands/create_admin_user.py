from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password


class Command(BaseCommand):
    help = 'Create an admin user for SRS Consulting admin panel'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, default='srsadmin', help='Admin username')
        parser.add_argument('--email', type=str, default='admin@srsnz.com', help='Admin email')
        parser.add_argument('--password', type=str, default='srsadmin2024', help='Admin password')

    def handle(self, *args, **options):
        username = options['username']
        email = options['email']
        password = options['password']

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.WARNING(f'User "{username}" already exists. Skipping creation.')
            )
            return

        # Create the admin user
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            is_staff=True,
            is_superuser=True,
            first_name='SRS',
            last_name='Admin'
        )

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created admin user "{username}" with email "{email}"'
            )
        )
        self.stdout.write(
            self.style.WARNING(
                f'Please change the default password "{password}" after first login!'
            )
        ) 