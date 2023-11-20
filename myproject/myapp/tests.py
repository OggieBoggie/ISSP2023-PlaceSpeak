from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from .models import Item, Van_Nbhd, Ca_Nbhd, User, Badges, UserBadge
from rest_framework import status

# Create your tests here.



class SaveUserTest(APITestCase):
    def test_create_user_success(self):
        # data = {'email': 'test@example.com', 'name': 'Test User', 'image': 'image_url'}
        data = {
            'email': 'test@example.com',
            'name': 'Test User',
            'image': 'http://example.com/image.jpg'  
        }
        response = self.client.post(reverse('save_user'), data)
        self.assertEqual(response.status_code, 201)
        # Assert response data

    def test_create_user_invalid_data(self):
        data = {'email': '', 'name': '', 'image': ''}
        response = self.client.post(reverse('save_user'), data)
        self.assertEqual(response.status_code, 400)
        # Assert error messages

class AwardVerificationBadgeTest(APITestCase):
    def setUp(self):
        # Create necessary objects like User and Badges
        self.user = User.objects.create(email='test@example.com', level=3) # Assuming level 3 is the criteria
        self.badge = Badges.objects.create(type=1, name='Verification')

    def test_award_badge_success(self):
        response = self.client.post(reverse('award-badge-to-user', kwargs={'email': self.user.email}), {'badge_name': 'Verification'})
        self.assertEqual(response.status_code, 200)
        self.assertIn("Badge 'Verification' awarded to user test@example.com.", response.data['message'])


    def test_user_not_found(self):
        response = self.client.post(reverse('award-badge-to-user', kwargs={'email': 'nonexistent@example.com'}), {'badge_name': 'Verification'})
        self.assertEqual(response.status_code, 404)

    # def test_user_not_meeting_criteria(self):
    #     user_not_eligible = User.objects.create(email='test2@example.com', level=1)
    #     print("Testing with email:", user_not_eligible.email)
    #     response = self.client.post(reverse('award-badge-to-user', kwargs={'email': user_not_eligible.email}), {'badge_name': 'Identity'})
    #     print("Response status code:", response.status_code)
    #     self.assertEqual(response.status_code, 400)

class GetUserBadgesTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create(email='test@example.com')
        self.badge = Badges.objects.create(type=1, name='Badge 1')
        UserBadge.objects.create(user=self.user, badge=self.badge)

    def test_get_user_badges_success(self):
        response = self.client.get(reverse('get-user-badges', args=[self.user.email]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)  # Assuming one badge is assigned
        self.assertEqual(response.data[0]['name'], 'Badge 1')

    def test_user_not_found(self):
        response = self.client.get(reverse('get-user-badges', args=['nonexistent@example.com']))
        self.assertEqual(response.status_code, 404)
