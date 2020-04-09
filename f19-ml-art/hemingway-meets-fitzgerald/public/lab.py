# NO ADDITIONAL IMPORTS!
from text_tokenize import tokenize_sentences


class Trie:
    def __init__(self):
        self.value = None
        self.children = {} # can be updated to a str/tuple to node
        self.type = None

    def set(self, key, value):
        """
        Add a key with the given value to the trie, or reassign the associated
        value if it is already present in the trie.  Assume that key is an
        immutable ordered sequence.  Raise a TypeError if the given key is of
        the wrong type.
        """
        if self.type == None:
            self.type = type(key)

        if type(key[0:1]) == self.type:
            if len(key) == 1:
                # reach the final
                # at this point key = key[0]
                # inside the last Trie
                if key in self.children:
                    self.children[key].value = value
                else:
                    nextTrie = Trie()
                    nextTrie.type = self.type
                    nextTrie.value = value
                    self.children[key] = nextTrie
            else:
                # still on the way or beginning
                if key[0:1] in self.children:
                    nextTrie = self.children[key[0:1]]
                else:
                    nextTrie = Trie()
                    nextTrie.type = self.type
                nextTrie.set(key[1:], value)
                self.children[key[0:1]] = nextTrie
        else:
            raise TypeError

    def get(self, key):
        """
        Return the value for the specified prefix.  If the given key is not in
        the trie, raise a KeyError.  If the given key is of the wrong type,
        raise a TypeError.
        """
        if type(key[0:1]) == self.type:
            if len(key) == 1:
                if key in self.children and self.children[key].value != None:
                    return self.children[key].value
                else:
                    raise KeyError
            else:
                # still on the way or beginning
                if key[0:1] in self.children:
                    return self.children[key[0:1]].get(key[1:])
                else:
                    raise KeyError
        else:
            raise TypeError

    def delete(self, key):
        """
        Delete the given key from the trie if it exists.
        """
        if type(key[0:1]) == self.type:
            if len(key) == 1:
                if key in self.children:
                    self.children[key].value = None
                else:
                    raise KeyError
            else:
                # still on the way or beginning
                if key[0:1] in self.children:
                    self.children[key[0:1]].delete(key[1:])
                else:
                    raise KeyError
        else:
            raise TypeError

    def contains(self, key):
        """
        Is key a key in the trie? return True or False.
        """
        if type(key[0:1]) == self.type:
            if len(key) == 1:
                if key in self.children and self.children[key].value != None:
                    return True
                else:
                    return False
            else:
                # still on the way or beginning
                if key[0:1] in self.children:
                    return self.children[key[0:1]].contains(key[1:])
                else:
                    return False
        else:
            raise TypeError

    def items(self):
        """
        Returns a list of (key, value) pairs for all keys/values in this trie and
        its children.
        """
        itemList = []
        def helper_find(node, tempList=None):

            if tempList == None and node.type == str:
                tempList = ['', None]
            elif tempList == None and node.type == tuple:
                tempList = [(), None]

            for k in node.children:
                # k is a single length str/tuple
                now = tempList[0] + k
                if node.children[k].value != None and node.children[k].children == {}:
                    # arrive one end
                    itemList.append((now, node.children[k].value))
                else:
                    # still on the way or beginning
                    if node.children[k].value != None:
                        itemList.append((now, node.children[k].value))
                    helper_find(node.children[k], [now, None])

        helper_find(self)
        return itemList


def make_word_trie(text):
    """
    Given a piece of text as a single string, create a Trie whose keys are the
    words in the text, and whose values are the number of times the associated
    word appears in the text
    """
    wordTrie = Trie()

    allText, sentenceList = '', tokenize_sentences(text)
    for sentence in sentenceList: allText += sentence + ' '
    stringList = allText.split()
    stringSet = set(stringList)

    for s in stringSet:
        wordTrie.set(s, stringList.count(s))
    return wordTrie

def make_phrase_trie(text):
    """
    Given a piece of text as a single string, create a Trie whose keys are the
    sentences in the text (as tuples of individual words) and whose values are
    the number of times the associated sentence appears in the text.
    """
    phraseTrie = Trie()

    sentenceList = tokenize_sentences(text) # sentenceList is a list of space-containing strings
    sentenceSet = set(sentenceList)

    for s in sentenceSet:
        tempTuple = tuple(s.split())
        phraseTrie.set(tempTuple, sentenceList.count(s))

    return phraseTrie

def autocomplete(trie, prefix, max_count=None):
    """
    Return the list of the most-frequently occurring elements that start with
    the given prefix.  Include only the top max_count elements if max_count is
    specified, otherwise return all.
    Raise a TypeError if the given prefix is of an inappropriate type for the
    trie.
    """
    returner = []

    def helper_is(theTuple, s_t):
        lS = len(s_t)
        if len(theTuple[0]) < lS:
            return False
        for s in range(lS):
            if s_t[s:s+1] != theTuple[0][s:s+1]:
                return False
        return True

    if type(prefix) != trie.type:
        raise TypeError

    if max_count == None:
        itemList = trie.items()
        for i in itemList:
            if helper_is(i, prefix):
                returner.append(i[0])
        return returner
    elif max_count == 0:
        return returner
    else:
        itemList = trie.items()
        itemList.sort(key=lambda x: x[1])
        itemList = itemList[::-1]
        for t in itemList:
            # t is a tuple
            if helper_is(t, prefix):
                returner.append(t[0])
                if len(returner) == max_count:
                    return returner
        return returner

def autocorrect(trie, prefix, max_count=None):
    """
    Return the list of the most-frequent words that start with prefix or that
    are valid words that differ from prefix by a small edit.  Include up to
    max_count elements from the autocompletion.  If autocompletion produces
    fewer than max_count elements, include the most-frequently-occurring valid
    edits of the given word as well, up to max_count total elements.
    """
    az = 'abcdefghijklmnopqrstuvwxyz'
    completeList = autocomplete(trie, prefix, max_count)
    C = len(completeList)
    # on the way, suggestions will be stored as {(word, frequency),( , ),( , )}

    def helper_refine_largest(theSet, targetNum):
        returner = []
        while targetNum > 0:
            next = max(theSet, key=lambda x: x[1])
            returner.append(next[0])
            theSet.remove(next)
            targetNum -= 1
        return returner

    def helper_delete_single(pickL):
        returner = set()
        for i in range(len(prefix)):
            newPrefix = prefix[:i] + prefix[i+1:]
            if trie.contains(newPrefix) and pickL:
                returner.add((newPrefix, trie.get(newPrefix)))
            elif trie.contains(newPrefix) and not pickL:
                returner.add(newPrefix)
        return returner

    def helper_switch(pickL):
        allWord = set()
        returner = set()

        for i in prefix:
            for j in prefix[prefix.index(i)+1:]:
                gap0 = prefix[: prefix.index(i)]
                gap1 = prefix[prefix.index(i)+1 : prefix.index(j)]
                gap2 = prefix[prefix.index(j)+1 :]
                allWord.add(gap0 + j + gap1 + i + gap2)

        for newPrefix in allWord:
            if trie.contains(newPrefix) and pickL:
                returner.add((newPrefix, trie.get(newPrefix)))  # a set of tuples(word and freq)
            elif trie.contains(newPrefix) and not pickL:
                returner.add(newPrefix)  # a set of words(str)
        return returner

    def helper_replace_and_add(pickL):
        returner = set()
        for i in range(len(prefix)):
            for j in az:
                # newPrefix_add = prefix[:i] + j + prefix[i:]
                # newPrefix_rep = prefix[:i] + j + prefix[i+1:]
                tempL = [prefix[:i] + j + prefix[i:], prefix[:i] + j + prefix[i+1:]]
                for t in tempL:
                    if trie.contains(t) and pickL:
                        returner.add((t, trie.get(t)))  # a set of tuples(word and freq)
                    elif trie.contains(t) and not pickL:
                        returner.add(t)  # a set of words(str)
        return returner

    def run_all(pickL):
        set_add_rep = helper_replace_and_add(pickL)
        set_switch = helper_switch(pickL)
        set_delete = helper_delete_single(pickL)
        allSet = set_add_rep | set_switch | set_delete
        if prefix in allSet:
            allSet.remove(prefix)
        return allSet

    if max_count == None:
        # Need to return all auto-complete and correct words
        pickL = False
        return completeList + list(run_all(pickL))

    elif max_count == 0:
        return []
    elif max_count - C == 0:
        return completeList
    else:
        # Need to auto-correct and refine
        targetNum = max_count - C
        pickL = True
        suggestedSet = run_all(pickL)
        suggestedList_refined = helper_refine_largest(suggestedSet, targetNum)
        return completeList + suggestedList_refined

def word_filter(trie, pattern):
    """
    Return list of (word, freq) for all words in trie that match pattern.
    pattern is a string, interpreted as explained below:
         * matches any sequence of zero or more characters,
         ? matches any single character,
         otherwise char in pattern char must equal char in word.
    """
    returner = []
    theP = pattern
    az0 = 'qwertyuiopasdfghjklzxcvbnm1234567890'

    while '**' in theP:
        newP = ' '
        for i in theP:
            if i != '*' or i != newP[-1]:
                newP += i
        theP = newP[1:]

    def match(node, p, tempList=None):
        if tempList == None:
            tempList = ['', None]

        if len(p) == 1:
            if p == '?':
                for k in node.children:
                    now = tempList[0] + k
                    if node.children[k].value != None:
                        returner.append((now, node.children[k].value))
                    else: continue
            elif p == '*':
                # when replaced with nothing
                if tempList[0] != '':
                    if node.value:
                        returner.append((tempList[0], node.value))
                for k in node.items():
                    # k is a tuple
                    now = tempList[0] + k[0]
                    returner.append((now, k[1]))
            else:
                if p in node.children:
                    if node.children[p].value:
                        now = tempList[0] + p
                        returner.append((now, node.children[p].value))
        else:
            # on the way or at beginning
            if p[0] == '?':
                for k in node.children:
                    # k is a single-length key
                    if p[1] in node.children[k].children or p[1] in '*?':
                        now = tempList[0] + k
                        match(node.children[k], p[1:], [now, None])

            elif p[0] == '*':
                # when replace '*' with nothing
                match(node, p[1:], tempList)
                # when replace '*' with something (near endless)
                for k in node.children:
                    now = tempList[0] + k
                    if p[1] in node.children[k].children:
                        match(node.children[k], p[1:], [now, None])
                    match(node.children[k], p, [now, None])

            elif p[0] not in '*?':
                if p[0] in node.children:
                    now = tempList[0] + p[0]
                    match(node.children[p[0]], p[1:], [now, None])

    def only(pattern):
        for i in az0:
            if i in pattern:
                return False
        return True

    if only(theP):
        ast = False
        length = theP.count('?')
        astNum = theP.count('*')
        if astNum > 0: ast = True

        def go_through(node, tempList=None):

            if tempList == None:
                tempList = ['', None]

            for k in node.children:
                # k is a single length str/tuple
                now = tempList[0] + k

                if node.children[k].value != None and node.children[k].children == {}:
                    if ast:
                        if len(now) >= length:
                            returner.append((now, node.children[k].value))
                    else:
                        if len(now) == length:
                            returner.append((now, node.children[k].value))

                else:
                    # still on the way or beginning
                    if ast:
                        if node.children[k].value != None and len(now) >= length:
                            returner.append((now, node.children[k].value))
                    else:
                        if node.children[k].value != None and len(now) == length:
                            returner.append((now, node.children[k].value))
                    go_through(node.children[k], [now, None])

        go_through(trie)

    else:
        match(trie, theP)
    return list(set(returner))

# you can include test cases of your own in the block below.
if __name__ == '__main__':
    pass
    # t = Trie()
    #
    # t.set('ab', 50)
    # t.set('bar', 10)
    # t.set('bart', 30)
    # t.set('bark', 20)
    # t.set('bat', 40)
    # t.set('bat', 70)
    # t.delete('bar')

    # t.set((1,2,3), 10)
    # t.set((1,5), 11)
    # t.set((1,2,4), 12)

    # print(t.items())
    # t2 = make_word_trie("bat bat bark bar")
    # print(t2.items())

    # t = make_word_trie("man mat mattress map me met a man a a a map man met")
    # print(autocorrect(t, 'cat',4))

    # print(word_filter(t, '*'))
    # with open('resources/corpora/Pride and Prejudice.txt', encoding='utf-8') as f:
    #     text = f.read()

    # book = make_phrase_trie(text)
    # bookWord = make_word_trie(text)
    # print('book ready')
    # print(autocorrect(bookWord, 'tear', 9))
    # print(word_filter(bookWord, 'r?c*t'))
