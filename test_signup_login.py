from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
import time

# Initialize WebDriver
driver = webdriver.Chrome()  # Ensure chromedriver is in PATH or provide its path

# Base URL
base_url = "file:///c:/Users/91817/Downloads/pro%202/pro/"

# Test Signup Functionality
def test_signup():
    driver.get(base_url + "signup.html")
    time.sleep(2)

    # Fill the signup form
    driver.find_element(By.ID, "fullname").send_keys("Test User")
    driver.find_element(By.ID, "email").send_keys("testuser@example.com")
    driver.find_element(By.ID, "password").send_keys("password123")
    driver.find_element(By.ID, "confirm-password").send_keys("password123")
    driver.find_element(By.CLASS_NAME, "btn").click()

    # Wait and check for alert
    time.sleep(2)
    alert = driver.switch_to.alert
    assert "Account created successfully!" in alert.text
    alert.accept()

# Test Signup with Mismatched Passwords
def test_signup_mismatch_password():
    driver.get(base_url + "signup.html")
    time.sleep(2)

    # Fill the signup form with mismatched passwords
    driver.find_element(By.ID, "fullname").send_keys("Test User")
    driver.find_element(By.ID, "email").send_keys("testuser@example.com")
    driver.find_element(By.ID, "password").send_keys("password123")
    driver.find_element(By.ID, "confirm-password").send_keys("password456")
    driver.find_element(By.CLASS_NAME, "btn").click()

    # Check for error message
    time.sleep(2)
    error_message = driver.find_element(By.ID, "error").text
    assert "Passwords do not match!" in error_message

# Test Login Functionality
def test_login():
    driver.get(base_url + "user-login.html")
    time.sleep(2)

    # Fill the login form
    driver.find_element(By.ID, "email").send_keys("testuser@example.com")
    driver.find_element(By.ID, "password").send_keys("password123")
    driver.find_element(By.CLASS_NAME, "btn").click()

    # Wait and check for redirection
    time.sleep(2)
    assert "index.html" in driver.current_url

# Test Login with Invalid Credentials
def test_login_invalid_credentials():
    driver.get(base_url + "user-login.html")
    time.sleep(2)

    # Fill the login form with invalid credentials
    driver.find_element(By.ID, "email").send_keys("invalid@example.com")
    driver.find_element(By.ID, "password").send_keys("wrongpassword")
    driver.find_element(By.CLASS_NAME, "btn").click()

    # Check for error message
    time.sleep(2)
    error_message = driver.find_element(By.ID, "error").text
    assert "Invalid email or password." in error_message

# Run Tests
try:
    test_signup()
    print("Signup test passed.")
    test_signup_mismatch_password()
    print("Signup mismatch password test passed.")
    test_login()
    print("Login test passed.")
    test_login_invalid_credentials()
    print("Login invalid credentials test passed.")
finally:
    driver.quit()
