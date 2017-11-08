import praw
import pandas as pd
import numpy as np
from sklearn.svm import SVR
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import MinMaxScaler
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score
import nltk
import re
import sys

def stem_tokens(tokens, stemmer):
    stemmed = []
    for item in tokens:
        stemmed.append(stemmer.stem(item))
    return stemmed
def tokenize(text):
    stemmer = nltk.PorterStemmer()
    text = re.sub("[^a-zA-Z]", " ", text)
    # tokenize
    tokens = nltk.word_tokenize(text)
    # stem
    stems = stem_tokens(tokens, stemmer)
    return stems


def test_prep(text_list, vectorizer):

    tokenized_text = [' '.join(tokenize(w)) for w in text_list]
    corpus_data_features = vectorizer.transform(tokenized_text)
    return corpus_data_features.toarray()

def testing_data(vectorizer, test_list):
    prepped_list = test_prep(test_list, vectorizer)
    return prepped_list, test_list

def main():
    reddit = praw.Reddit(user_agent = 'nwHacks2017', client_id = 'MsvIeN0_UFP2cw',
                         client_secret = "j1FsIUdYAqA63_3Fn5y-x0djuz8", username = 'Zhanger',
                         password = '*sg$afoBelfZmB8A')
    vegan_header = []
    for submission in reddit.subreddit('science').top(limit = None):
        # print (submission.title + ',' + str(submission.ups))
        vegan_header.append([submission.title, abs(submission.ups)])

    vegan_header_df = pd.DataFrame(data = vegan_header, columns = ["header", "upvotes"])

    sentence = ""
    arguments = sys.argv
    arguments.pop(0)
    for tags in arguments:
        sentence += tags + " "

    sentence = sentence[:-1]
    tags_array = [sentence]
    print(tags_array)

    vegan_header_df.upvotes -= vegan_header_df.upvotes.min()
    vegan_header_df.upvotes /= vegan_header_df.upvotes.max()
    vegan_header_df.upvotes = round(vegan_header_df.upvotes * 5)

    vegan_header_df.upvotes.apply(lambda x: (x - np.mean(x)) / np.std(x))
    #print(vegan_header_df.upvotes)

    vectorizer = CountVectorizer(
        analyzer='word',
        lowercase=True,
        stop_words='english',
        max_features=85
    )
    #split into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        vegan_header_df.header,
        vegan_header_df.upvotes,
        train_size=0.85,
        random_state=1234)

    train_list = X_train.tolist()
    test_list = X_test.tolist()
    result_list = y_train.tolist()
    test_result_list = y_test.tolist()

    tokenized_list = [' '.join(tokenize(w)) for w in train_list]
    tokenized_test = [' '.join(tokenize(w)) for w in test_list]

    corpus_data_features = vectorizer.fit_transform(tokenized_list).toarray()
    corpus_test_features = vectorizer.transform(tokenized_test).toarray()

    ####
    vectorizer.vocabulary_.get(u'algorithm')
    tf_transformer = TfidfTransformer(use_idf=False).fit(corpus_data_features)
    X_train_tf = tf_transformer.transform(corpus_data_features)
    # corpus_data_features_nd = corpus_data_features.toarray()
    vectorizer.vocabulary_.get(u'algorithm')
    tf_transformer = TfidfTransformer(use_idf=False).fit(corpus_test_features)
    X_test_tf = tf_transformer.transform(corpus_test_features)

    ###
    #*changed X=corpus_data_features to X= X_train_tf
    classifier = svm.SVC()
    classifier = classifier.fit(X=X_train_tf, y=result_list)


    test, original = testing_data(vectorizer, tags_array)
    svr_poly = SVR(kernel="poly", degree=2, C=1e3)
    y_poly = svr_poly.fit(X_train_tf, result_list).predict(test)*50
    #*changed poly.fit(corpus_data_features, to poly.fit(X_train_tf
    print(y_poly[0])

   # test_pred = classifier.predict(test)
    #original = [' '.join(tokenize(w)) for w in original]
    #raw_data = {'text': original, 'sentiment': test_pred}
    #df = pd.DataFrame(raw_data,columns=['text','sentiment'])
    #print(df)
main()
