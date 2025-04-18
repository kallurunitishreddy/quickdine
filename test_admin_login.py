from selenium import webdriver
from selenium.webdriver.common.by import By
import time

# Initialize WebDriver
driver = webdriver.Chrome()

# Base URL
base_url = "file:///c:/Users/91817/Downloads/pro%202/pro/"

# Test Admin Login with Empty Fields
def test_admin_login_empty_fields():
    driver.get(base_url + "admin-login.html")
    time.sleep(2)

    driver.find_element(By.CLASS_NAME, "btn").click()
    time.sleep(2)
    error_message = driver.find_element(By.ID, "error").text
    assert "All fields are required!" in error_message

# Test Admin Login with Invalid Credentials
def test_admin_login_invalid_credentials():
    driver.get(base_url + "admin-login.html")
    time.sleep(2)

    driver.find_element(By.ID, "adminid").send_keys("wrongadmin")
    driver.find_element(By.ID, "adminpass").send_keys("wrongpassword")
    driver.find_element(By.CLASS_NAME, "btn").click()

    time.sleep(2)
    error_message = driver.find_element(By.ID, "error").text
    assert "Invalid Admin ID or password." in error_message

# Test Admin Login with Valid Credentials
def test_admin_login_valid_credentials():
    driver.get(base_url + "admin-login.html")
    time.sleep(2)

    driver.find_element(By.ID, "adminid").send_keys("admin")
    driver.find_element(By.ID, "adminpass").send_keys("admin123")
    driver.find_element(By.CLASS_NAME, "btn").click()

    time.sleep(2)
    assert "admin.html" in driver.current_url

# Run Tests
try:
    test_admin_login_invalid_credentials()
    print("Admin login invalid credentials test passed.")
    test_admin_login_valid_credentials()
    print("Admin login valid credentials test passed.")
finally:
    driver.quit()
