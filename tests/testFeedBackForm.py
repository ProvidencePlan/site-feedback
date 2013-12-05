from selenium import selenium
from selenium import webdriver
from selenium.webdriver.common.keys import Keys 
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC 

import unittest

class FeedBackForm(unittest.TestCase):

	def setUp(self):
		self.driver = webdriver.Firefox()
		self.driver.implicitly_wait(10)
		self.driver.get('http://10.1.1.119:5000/?s=profiles')

	def tearDown(self):
		self.driver.quit()


	def test_submit_Form(self):

		sd = self.driver

		topic_selection = sd.find_element_by_id('issue')
		for option in topic_selection.find_elements_by_tag_name('option'):
			if option.text == "Bug Report":
				option.click()

		name = sd.find_element_by_id('name-inp')
		name.send_keys('Jane Doe')

		email = sd.find_element_by_id('email-inp')
		email.send_keys('test@testy.com')

		message = sd.find_element_by_id('content-inp')
		message.send_keys('This is a test. this is a test, this is a test.')

		response_ckbx = sd.find_element_by_css_selector('#follow-up input')
		response_ckbx.click()

		submit_btn = sd.find_element_by_id('submit-btn')
		submit_btn.click()

		self.page = sd.page_source
		self.assertTrue("Thank You!" in self.page)

if __name__ == '__main__':
    unittest.main()