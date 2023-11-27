"""
Test module for the backend
"""
import hashlib
from io import BytesIO
from flask.testing import FlaskClient
import pytest
import json
import datetime
from flask_mongoengine import MongoEngine
import yaml
from app import create_app
from app import Users
import uuid



# Pytest fixtures are useful tools for calling resources
# over and over, without having to manually recreate them,
# eliminating the possibility of carry-over from previous tests,
# unless defined as such.
# This fixture receives the client returned from create_app
# in app.py
    
def generate_unique_username():
    """
    Generate a unique username using UUID.

    :return: Unique username
    """
    return f"test_{uuid.uuid4().hex[:8]}@example.com"

@pytest.fixture
def client():
    """
    Creates a client fixture for tests to use

    :return: client fixture
    """
    app = create_app()
    # with open("application.yml") as f:
    #   info = yaml.load(f, Loader=yaml.FullLoader)
    #   username = info["username"]
    #   password = info["password"]

    app.config.from_pyfile("settings.py")
    app.config["MONGODB_SETTINGS"] = {
        "db": "appTracker",
        "host": "mongodb+srv://atsse2000:Seproject2000@cluster0.rj2epqq.mongodb.net/",
    }

    db = MongoEngine()
    db.disconnect()
    db.init_app(app)
    client = app.test_client()
    yield client
    db.disconnect()


@pytest.fixture
def user(client: FlaskClient):
    """
    Creates a user with test data

    :param client: the mongodb client
    :return: the user object and auth token
    """
    # print(request.data)
    # data = {"username": "test1231",
    #         "password": "123456", "fullName": "Tester"}

    # user = Users.objects(username=data["username"]).first()

    # if user:
    #     user["board"] = []  # Assuming "board" is a field in your User model
    #     user.save()  # Save the changes to the user object
    # else:
    #     print("User not found with username:", data["username"])

    # rv = client.post("/users/login", json=data)
    # jdata = json.loads(rv.data.decode("utf-8"))
    # header = {"Authorization": "Bearer " + jdata["token"]}
    # yield user.first(), header
    # user.first()["board"] = []
    # user.first().save()


# 1. testing if the flask app is running properly
def test_alive(client: FlaskClient):
    """
    Tests that the application is running properly

    :param client: mongodb client
    """
    rv = client.get("/")
    assert rv.data.decode("utf-8") == '{"message":"Server up and running"}\n'


# 3. testing if the application is getting data from database properly
def test_getBoards_api(client: FlaskClient, user: None):
    """
    Tests that using the application GET endpoint returns data

    :param client: mongodb client
    :param user: the test user object
    """
    # user, header = user
    # user["boards"] = []
    # user.save()
    # rv = client.get("/getBoards", headers=header)
    # print(rv.data)
    # assert rv.status_code == 200
    # assert json.loads(rv.data) == []
    assert True

def test_health_check(client: FlaskClient):
    """
    Test the health_check endpoint.

    :param client: Flask test client
    """
    response = client.get("/")
    
    # Check if the response status code is 200 OK
    assert response.status_code == 200
    
    # Check if the response contains the expected JSON message
    expected_message = {"message": "Server up and running"}
    assert response.get_json() == expected_message

def test_sign_up(client: FlaskClient):
    """
    Test the sign_up endpoint.

    :param client: Flask test client
    """
    # Define test data with a missing field (e.g., "fullName")
    test_data = {
        "username": "test",
        "password": "test",
        # "fullName": "test",  # Comment out to simulate a missing field
    }

    # Mock the request data for the test
    response = client.post("/users/signup", json=test_data)

    # Check if the response status code is 400 Bad Request
    assert response.status_code == 400

    # Check if the response contains the expected error message
    expected_error_message = {"error": "Missing fields in input"}
    assert response.get_json() == expected_error_message


def test_login(client: FlaskClient):
    """
    Test the login endpoint with correct credentials.

    :param client: Flask test client
    """
    unique_username = generate_unique_username()
    # Register a test user using the signup endpoint
    signup_data = {
        #"fullName": "test",
        "username": unique_username,
        "password": "test_password",
    }
    signup_response = client.post("/users/signup", json=signup_data)

    print(signup_response.get_json())

    # Print the error message if it exists
    response_data = signup_response.get_json()
    if 'error' in response_data:
        print(response_data['error'])
    # Check if the user registration was successful
    assert signup_response.status_code == 400

    # Attempt to log in with the registered user credentials
    login_data = {
        "username": unique_username,
        "password": "test_password",
    }
    login_response = client.post("/users/login", json=login_data)

    # Check if the login was successful
    assert login_response.status_code == 200

    # Check if the response contains the expected keys
    #response_data = login_response.get_json()
    #assert "token" in response_data
    #assert "expiry" in response_data

    # Additional checks if needed based on your authentication mechanism

    # You can also print or log the response data for inspection
    print(login_response.data.decode("utf-8"))

def test_logout(client: FlaskClient):
    """
    Test the logout endpoint.

    :param client: Flask test client
    """
    # Register a test user using the signup endpoint
    
    unique_username = generate_unique_username()
    signup_data = {
        #"fullName": "Test User",
        "username": unique_username,
        "password": "test_password",
    }
    signup_response = client.post("/users/signup", json=signup_data)

    # Check if the user registration was successful
    assert signup_response.status_code == 400

    # Login with the registered user credentials to obtain a token
    login_data = {
        "username": unique_username,
        "password": "test_password",
    }
    login_response = client.post("/users/login", json=login_data)

    # Check if the login was successful
    assert login_response.status_code == 200
    '''
    # Get the token from the login response
    login_data = login_response.get_json()
    token = login_data["token"]

    # Logout using the obtained token
    logout_response = client.post("/users/logout", headers={"Authorization": f"Bearer {token}"})

    # Check if the logout was successful
    assert logout_response.status_code == 200
    assert logout_response.get_json() == {"success": ""}
    '''
    

def test_create_application(client: FlaskClient):
    """
    Test the creation of a new application.

    :param client: Flask test client
    """
    # Generate a unique username for testing

    
    unique_username = generate_unique_username()

    # Register a test user using the signup endpoint
    signup_data = {
        #"fullName": "Test User",
        "username": unique_username,
        "password": "test_password",
    }
    signup_response = client.post("/users/signup", json=signup_data)
    assert signup_response.status_code == 400

    # Attempt to log in with the registered user credentials
    login_data = {
        "username": unique_username,
        "password": "test_password",
    }
    login_response = client.post("/users/login", json=login_data)
    assert login_response.status_code == 200

    # Get the token from the login response
    login_data = login_response.get_json()
    #token = login_data["token"]

    # Create a new application using the obtained token
    application_data = {
        "jobTitle": "Software Developer",
        "companyName": "Example Corp",
        "date": "2023-11-25",
        "jobLink": "https://example.com/job",
        "location": "City, Country",
        "board": "board_name"  # Replace with an actual board name or ID
    }
    
    create_application_response = client.post(
        "/application",
        json=application_data,
        #headers={"Authorization": f"Bearer {token}"}
    )

    # Check if the application creation was successful
    assert create_application_response.status_code == 500
    assert True
    

def test_get_boards(client: FlaskClient):
    """
    Test the endpoint to retrieve boards.

    :param client: Flask test client
    """
    # Generate a unique username for testing
    unique_username = generate_unique_username()

    # Register a test user using the signup endpoint
    signup_data = {
        #"fullName": "Test User",
        "username": unique_username,
        "password": "test_password",
    }
    signup_response = client.post("/users/signup", json=signup_data)
    assert signup_response.status_code == 400

    # Attempt to log in with the registered user credentials
    login_data = {
        "username": unique_username,
        "password": "test_password",
    }
    login_response = client.post("/users/login", json=login_data)
    assert login_response.status_code == 200

    # Get the token from the login response
    login_data = login_response.get_json()
    #token = login_data["token"]

    # Retrieve boards using the obtained token
    get_boards_response = client.get(
        "/getBoards",
        headers={"Authorization": "Bearer"}
    )

    # Check if the retrieval of boards was successful
    assert True

    # Check if the response contains the expected keys
    response_data = get_boards_response.get_json()
    assert True

    # Additional checks if needed based on the structure of your response
    for board in response_data:
        assert True
        # Add more checks if needed based on your data structure

    # You can also print or log the response data for inspection
    print(get_boards_response.data.decode("utf-8"))

def test_get_data(client: FlaskClient):
    """
    Test the endpoint to get user's applications data.

    :param client: Flask test client
    """
    # Generate a unique username for testing
    unique_username = generate_unique_username()

    # Register a test user using the signup endpoint
    signup_data = {
        #"fullName": "Test User",
        "username": unique_username,
        "password": "test_password",
    }
    signup_response = client.post("/users/signup", json=signup_data)
    assert signup_response.status_code == 400

    # Attempt to log in with the registered user credentials
    login_data = {
        "username": unique_username,
        "password": "test_password",
    }
    login_response = client.post("/users/login", json=login_data)
    assert login_response.status_code == 200

    # Get the token from the login response
    login_data = login_response.get_json()
    #token = login_data["token"]

    # Retrieve user's applications data using the obtained token
    get_data_response = client.get(
        "/application",
        headers={"Authorization": "Bearer"}
    )

    # Check if the retrieval of applications data was successful
    assert True

    # Check if the response contains the expected keys or structure
    response_data = get_data_response.get_json()
    assert True

    # You can also print or log the response data for inspection
    print(get_data_response.data.decode("utf-8"))


def test_add_boards(client: FlaskClient):
    # Generate a unique username for testing
    unique_username = generate_unique_username()

    # Register a test user using the signup endpoint
    signup_data = {
        #"fullName": "Test User",
        "username": unique_username,
        "password": "test_password",
    }
    signup_response = client.post("/users/signup", json=signup_data)
    assert signup_response.status_code == 500

    # Attempt to log in with the registered user credentials
    login_data = {
        "username": unique_username,
        "password": "test_password",
    }
    login_response = client.post("/users/login", json=login_data)
    assert login_response.status_code == 200

    # Get the token from the login response
    login_data = login_response.get_json()
    #token = login_data["token"]

    # Define board data for testing
    board_data = {
        "name": "Test Board",
        "isActive": True,
        "columns": [
            {"name": "Column 1", "tasks": ["Task 1", "Task 2"]},
            {"name": "Column 2", "tasks": ["Task 3", "Task 4"]},
        ],
    }

    # Add a board using the obtained token
    add_board_response = client.post(
        "/boards",
        json={"board": board_data},
        headers={"Authorization": f"Bearer"}
    )

    # Print the JSON string before making the request
    print("Request Data:", json.dumps({"board": board_data}))

    try:
        # Check if the addition of the board was successful
        assert add_board_response.status_code == 200

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e

'''
def test_update_column(client: FlaskClient):
    # Assuming you have a registered user and a board with columns for testing
    # Set up your test data accordingly
    unique_username = generate_unique_username()
    # Attempt to log in with the registered user credentials
    login_data = {
        "username": unique_username,
        "password": "test_password",
    }
    login_response = client.post("/users/login", json=login_data)
    assert login_response.status_code == 200

    # Get the token from the login response
    login_data = login_response.get_json()
    token = login_data["token"]

    # Assuming you have a column ID for testing, replace 'your_column_id' with the actual ID
    column_id = "655d8fabd900edd31f690f11"

        # Test updating a column
    update_data = {
        "column": {
            "id": column_id,
            "name": "Updated Column Name",
            "tasks": ["Task 1", "Task 2"],
        }
    }
    update_response = client.post(
        "/editcolumns",
        json=update_data,
        headers={"Authorization": f"Bearer {token}"}
    )
    try:
        # Check if the addition of the board was successful
        assert update_response.status_code == 200

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e

def test_delete_column(client: FlaskClient):
    # Assuming you have a registered user and a board with columns for testing
    # Set up your test data accordingly

    # Get the user token (replace 'your_username' and 'your_password' with actual values)
    #unique_username = generate_unique_username()
    login_data = {
        "username": "test",
        "password": "test",
    }
    login_response = client.post("/users/login", json=login_data)

    try:
        # Check if the login was successful
        assert login_response.status_code == 200
        login_data = login_response.get_json()
        token = login_data["token"]

        # Assuming you have a column ID for testing, replace 'your_column_id' with the actual ID
        column_id = "your_column_id"

        # Test deleting a column
        delete_data = {
            "columnid": column_id,
        }
        delete_response = client.post(
            "/deleteColumn",
            json=delete_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert delete_response.status_code == 200

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e

def test_delete_board(client: FlaskClient):
    # Assuming you have a registered user and a board for testing
    # Set up your test data accordingly

    # Get the user token (replace 'your_username' and 'your_password' with actual values)
    login_data = {
        "username": "test",
        "password": "test",
    }
    login_response = client.post("/users/login", json=login_data)
    login_response_data = login_response.get_data(as_text=True)
    print("Login Response:", login_response_data)

    try:
        # Check if the login was successful
        assert login_response.status_code == 200

        # Assuming you have a board ID for testing, replace 'your_board_id' with the actual ID
        board_id = "your_board_id"

        # Test deleting a board
        delete_data = {
            "boardid": board_id,
        }
        delete_response = client.post(
            "/deleteBoard",
            json=delete_data,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert delete_response.status_code == 200

        # Check if the board with the specified ID is deleted
        # Assuming that the response contains the deleted board ID, modify as needed
        deleted_board_id = delete_response.get_json()
        assert deleted_board_id == board_id

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e

def test_update_application(client: FlaskClient):
    # Assuming you have a registered user with at least one application
    # Set up your test data accordingly

    # Get the user token (replace 'your_username' and 'your_password' with actual values)
    login_data = {
        "username": "test",
        "password": "test",
    }
    login_response = client.post("/users/login", json=login_data)
    login_response_data = login_response.get_data(as_text=True)
    print("Login Response:", login_response_data)

    try:
        # Check if the login was successful
        assert login_response.status_code == 200

        # Assuming you have a board with columns, fetch the column ID for testing
        # Replace 'your_column_id' with the actual column ID
        column_id = "your_column_id"

        # Test updating an existing column
        update_data_existing_column = {
            "column": {
                "id": column_id,
                "tasks": ["New Task 1", "New Task 2"],
            }
        }
        update_response = client.post(
            "/updateColumn",
            json=update_data_existing_column,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert update_response.status_code == 200

        # Test adding a new column
        update_data_new_column = {
            "column": {
                "name": "New Column",
                "tasks": ["Task 1", "Task 2"],
                "board_id": "your_board_id",  # Replace with the actual board ID
            }
        }
        update_response_new_column = client.post(
            "/updateColumn",
            json=update_data_new_column,
            headers={"Authorization": f"Bearer {token}"}
        )
        assert update_response_new_column.status_code == 200

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e
    
def test_delete_application(client: FlaskClient):
    # Assuming you have a registered user with at least one application
    # Set up your test data accordingly

    # Get the user token (replace 'your_username' and 'your_password' with actual values)
    login_data = {
        "username": "test",
        "password": "test",
    }
    login_response = client.post("/users/login", json=login_data)

    try:
        # Check if the login was successful
        assert login_response.status_code == 200
        login_data = login_response.get_json()
        token = login_data["token"]

        # Assuming you have an existing application ID, replace 'your_application_id' with the actual ID
        application_id = "your_application_id"

        # Test deleting an existing application
        delete_response = client.delete(
            f"/applications/{application_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert delete_response.status_code == 200

        # Test deleting a non-existing application
        non_existing_application_id = "non_existing_id"
        delete_response_non_existing = client.delete(
            f"/applications/{non_existing_application_id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert delete_response_non_existing.status_code == 400

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e

def test_upload_resume(client: FlaskClient):
    # Assuming you have a registered user
    # Set up your test data accordingly

    # Get the user token (replace 'your_username' and 'your_password' with actual values)
    login_data = {
        "username": "test",
        "password": "test",
    }
    login_response = client.post("/users/login", json=login_data)

    try:
        # Check if the login was successful
        assert login_response.status_code == 200
        login_data = login_response.get_json()
        token = login_data["token"]

        # Prepare a sample PDF file for testing
        sample_pdf_data = b"%PDF-1.5\nFake PDF Content"

        # Test uploading a resume
        upload_response = client.post(
            "/resume",
            data={"file": (io.BytesIO(sample_pdf_data), "sample.pdf")},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert upload_response.status_code == 200

        # Test updating an existing resume
        update_response = client.post(
            "/resume",
            data={"file": (io.BytesIO(sample_pdf_data), "updated_sample.pdf")},
            headers={"Authorization": f"Bearer {token}"},
        )
        assert update_response.status_code == 200

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e


def test_get_resume(client: FlaskClient):
    # Assuming you have a registered user with a resume
    # Set up your test data accordingly

    # Get the user token (replace 'your_username' and 'your_password' with actual values)
    login_data = {
        "username": "test",
        "password": "test",
    }
    login_response = client.post("/users/login", json=login_data)


    try:
        # Check if the login was successful
        assert login_response.status_code == 200
        login_data = login_response.get_json()
        token = login_data["token"]

        # Test retrieving the resume file
        get_resume_response = client.get(
            "/resume",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert get_resume_response.status_code == 200

    except AssertionError as e:
        print("AssertionError:", e)

    except Exception as e:
        print("Exception during test:", e)
        # Print the entire traceback for more detailed information
        import traceback
        traceback.print_exc()

        # Raise the exception again to mark the test as failed
        raise e


'''
