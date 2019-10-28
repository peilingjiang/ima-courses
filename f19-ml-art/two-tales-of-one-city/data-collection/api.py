# Based on NewsAPI and Microsoft Bing News API
# Peiling Jiang 2019

from apikeys import *

from newsapi.newsapi_client import NewsApiClient
from azure.cognitiveservices.search.newssearch import NewsSearchAPI
from msrest.authentication import CognitiveServicesCredentials

# Actual keys are stored in another file
# Apply for API keys on:
# https://newsapi.org/
# https://azure.microsoft.com/en-us/free/
news_api = NewsApiClient(api_key=news_api_key)
azure_subscription_key = azure_api_key

if __name__ == '__main__':
    # Pre-retrieve for NewsAPI
    # pre_en_articles = news_api.get_everything(q='Hong OR Kong OR HongKong OR (China AND Protest)',
    #                                           language='en')
    # print(pre_en_articles['totalResults'])
    # for i in range(1, pre_en_articles['totalResults'] // 100 + 1):
    #     # page max is 100
    #     en_articles = news_api.get_everything(q='Hong OR Kong OR HongKong OR China OR Protest',
    #                                           language='en',
    #                                           sort_by='relevancy',
    #                                           page_size=100,
    #                                           page=i)
    #     for article in en_articles['articles']:
    #         if isinstance(article['title'], str):
    #             with open('en_name.txt', 'a') as f:
    #                 f.write(article['title'] + '\n')

    # Get with Azure API
    client = NewsSearchAPI(CognitiveServicesCredentials(azure_subscription_key))
    # English
    # for offset in range(0, 601):
    #     news_result = client.news.search(query='Hong Kong', market="en-US", count=100, offset=offset*100, safeSearch='Off', freshness='Month')
    #     if news_result.value:
    #         for result in news_result.value:
    #             with open('en_name.txt', 'a') as f:
    #                 f.write(result.name + '\n')
    #             with open('en_description.txt', 'a') as f:
    #                 f.write(result.description)
    #                 f.write('\n')
    # print('English done')
    # # Chinese
    # for offset in range(0, 601):
    #     news_result = client.news.search(query='香港', market="zh-cn", count=100, offset=offset*100, safeSearch='Off', freshness='Month')
    #     if news_result.value:
    #         for result in news_result.value:
    #             with open('zh_name.txt', 'a') as f:
    #                 f.write(result.name + '\n')
    #             with open('zh_description.txt', 'a') as f:
    #                 f.write(result.description)
    #                 f.write('\n')
    # print('Chinese done')

    # Get img using NewsAPI
    # en_list = []
    # zh_list = []
    # en_articles = news_api.get_everything(q='Hong OR Kong OR HongKong OR China OR Protest',
    #                                       language='en',
    #                                       sort_by='relevancy',
    #                                       page_size=30,
    #                                       page=1)
    # for article in en_articles['articles']:
    #     en_list.append(article['urlToImage'])
    # print(en_list)
    # zh_articles = news_api.get_everything(q='香港',
    #                                       sources='xinhua-net',
    #                                       sort_by='relevancy',
    #                                       page_size=30,
    #                                       page=1)
    # for article in zh_articles['articles']:
    #     zh_list.append(article['urlToImage'])
    # print(zh_list)
