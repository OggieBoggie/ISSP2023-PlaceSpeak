from .models import Badges

def create_badges():
    # Define badge details
    badges_info = [
        {"type": 1, "name": "Identity", "description": "Awarded for identity verification up to 3 levels."},
        {"type": 2, "name": "Participation", "description": "Awarded for participating in various topics."},
        {"type": 3, "name": "Inviting", "description": "Awarded for inviting neighbors to join."},
        {"type": 4, "name": "Involving", "description": "Awarded for involvement in discussions through comments."},
        {"type": 5, "name": "Consult", "description": "Awarded for taking part in polls."}
    ]

    # Create and save each badge
    for badge_info in badges_info:
        badge, created = Badges.objects.get_or_create(
            type=badge_info["type"],
            defaults={
                "name": badge_info["name"],
                "description": badge_info["description"]
            }
        )

        if created:
            print(f"Badge '{badge.name}' created successfully.")
        else:
            print(f"Badge '{badge.name}' already exists.")

# Call the function to create badges
create_badges()
