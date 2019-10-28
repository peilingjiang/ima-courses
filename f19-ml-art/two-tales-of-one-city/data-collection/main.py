# Thanks to Jack-Cui from blog.csdn.net
# The use of this code is totally for personal research

# A easy to use web content reader
# 2019

from selenium import webdriver
from bs4 import BeautifulSoup

chrome_options = webdriver.ChromeOptions()
prefers = {"profile.managed_default_content_settings.images": 2}
chrome_options.add_experimental_option("prefs", prefers)

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

english_list = ['https://www.cnn.com/search?q=Hong%20Kong&size=100&type=article&category=world',
                'https://www.cnn.com/search?q=Hong%20Kong&size=100&type=article&category=politics',
                'https://www.bbc.co.uk/search?q=Hong+Kong&filter=news&suggid=',
                'https://www.foxnews.com/search-results/search?q=Hong%20Kong&ss=fn&section.path=fnc/politics,fnc/world&type=story&start=']

chinese_list = []


def is_contain(a_list, string):
    for l in a_list:
        if l in string:
            return True
    return False


class Downloader:
    def __init__(self, category):
        self.server = ''
        self.target = english_list  # The target to download from
        self.i = 0  # Keep track of which url target has been reviewed
        self.category = category  # 'e' for English, 'c' for Chinese
        if category == 'e':
            self.target = english_list
        elif category == 'c':
            self.target = chinese_list
        # self.names = []
        self.urls = []

    def get_download_url(self):
        """
        Put all url to download from in a list
        """
        # Start the Chrome driver
        driver = webdriver.Chrome(options=chrome_options)
        if self.category == 'e':
            nameFile = open('english_names.txt', 'w+')
        elif self.category == 'c':
            nameFile = open('chinese_names.txt', 'w+')
        while self.i < len(self.target):
            target = self.target[self.i]
            if 'cnn' in target:
                if debug:
                    total = 2
                else:
                    total = 41
                for j in range(1, total):  # First 20 * 100 news
                    driver.get(target + '&from=' + str(100 * (j - 1)) + '&page=' + str(j))
                    # print(target + '&from=' + str(100 * (j - 1)) + '&page=' + str(j))
                    page = BeautifulSoup(driver.page_source, 'html.parser')
                    div_list = page.find_all('h3', class_='cnn-search__result-headline',
                                             recursive=True)  # Find all title div
                    for div in div_list:
                        a = div.find('a')
                        if a.string:
                            nameFile.write(a.string + '\n')
                            self.urls.append(a.get('href'))
            elif 'bbc' in target:
                if debug:
                    total = 2
                else:
                    total = 30
                driver.get(target)
                # Click on the bbc.co.uk website Show more results button for 50 times first
                for j in range(total):
                    WebDriverWait(driver, 20).until(
                        EC.element_to_be_clickable((By.LINK_TEXT, 'Show more results'))).click()
                page = BeautifulSoup(driver.page_source, 'html.parser')
                ol_list = page.find_all('ol', class_='search-results results', recursive=True)
                for ol in ol_list:
                    h1_list = ol.find_all('h1')
                    for h in h1_list:
                        a = h.find('a')
                        if a.string:
                            nameFile.write(a.string + '\n')
                            self.urls.append(a.get('href'))
            elif 'foxnews' in target:
                if debug:
                    total = 1
                else:
                    total = 50  # 50 * 10
                for j in range(total):
                    driver.get(target + str(10 * j))
                    page = BeautifulSoup(driver.page_source, 'html.parser')
                    h3_list = page.find_all('h3', recursive=True)
                    for h in h3_list:
                        a = h.find('a')
                        if a.string:
                            nameFile.write(a.string + '\n')
                            self.urls.append(a.get('href'))
            # elif 'abcnews' in target:
            #     if debug: total = 5
            #     else: total = 50  # 50 * 10
            #     for j in range(total):
            #         driver.get(target + '#' + str(10 * j) + '_')
            #         page = BeautifulSoup(driver.page_source, 'html.parser')
            #         div_list = page.find_all('div', class_='result Story', recursive=True)
            #         for div in div_list:
            #             a = div.find('a', class_='title')
            #             if a.get_text():
            #                 nameFile.write(a.get_text() + '\n')
            #                 self.urls.append(a.get('href'))
            #         driver.execute_script("loadResults(this, " + str(10 * (j + 1)) + ", '');")
            else:
                continue
            self.i += 1
            print(str(self.i) + ' target read finished.')
        driver.quit()  # Quit the driver
        nameFile.close()  # Close the file
        print('URL built successfully.')
        # print(self.urls)

    def download(self, u, driver):
        # Take u as url as input
        if 'cnn' in u:
            text = ''
            driver.get('https:' + u)
            page = BeautifulSoup(driver.page_source, 'html.parser')
            main_div = page.find_all('div', class_='pg-rail-tall__body', recursive=True)
            for m in main_div:
                if m:
                    section = m.find('section', recursive=True)
                    if section:
                        div = section.find_all('div', class_='l-container', recursive=True)
                        for d in div:
                            if d and not is_contain(('@', '|', 'MUST WATCH'), d.get_text()):
                                text += d.get_text()
            text = text.replace('(CNN)', '')
            print(text)
            return text

    def get_content(self, path, content):
        with open(path, 'a+') as f:
            f.write(content)
            if content:
                f.write('\n\n')


if __name__ == '__main__':
    debug = False
    english_dl = Downloader('e')
    english_dl.get_download_url()
    # chinese_dl = Downloader('c')
    # chinese_dl.get_download_url()

    # Download english content
    # print('Start downloading English content.')
    # downloadDriver = webdriver.Chrome(options=chrome_options)
    # for url in english_dl.urls:
    #     english_dl.get_content('english_content.txt', english_dl.download(url, downloadDriver))
    # downloadDriver.quit()
