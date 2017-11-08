import praw
import pandas as pd

reddit = praw.Reddit(user_agent = 'nwHacks2017', client_id = 'MsvIeN0_UFP2cw',
                         client_secret = "j1FsIUdYAqA63_3Fn5y-x0djuz8", username = 'Zhanger',
                         password = '*sg$afoBelfZmB8A')

vegan_header = []

for submission in reddit.subreddit('food').top(limit = None):
    # print (submission.title + ',' + str(submission.ups))
    vegan_header.append([submission.title, submission.ups])

vegan_header_df = pd.DataFrame(data = vegan_header, columns = ["header", "upvotes"])

vegan_header_df.to_csv("food.csv", sep='\t')
