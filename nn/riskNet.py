import tensorflow as tf
import numpy as np
import os
os.environ['TF_CPP_MIN_LOG_LEVEL']='2'
#import input_data
########################################################################################
''' creating pseudo-random data '''
from random import randint

def init_weights(shape):
    return tf.Variable(tf.random_normal(shape, stddev=0.01))
    # self.W1 = np.random.randn(self.inputLayerSize, self.hiddenLayerSize)
    # self.W2 = np.random.randn(self.hiddenLayerSize, self.outputLayerSize)

def model(X, w_h, w_o):
	z2 = tf.matmul(X, w_h)
	a2 = tf.nn.sigmoid(z2)
	z3 = tf.matmul(a2, w_o)
	yhat = tf.nn.sigmoid(z3)
	print(z3)
	print(yhat)
	return yhat

ti = []
ta = []
for i in range(0,500):
	a = randint(5,25)
	b = randint(0,12)
	c = randint(0,8)
	d = randint(0,5)
	ti.append([a,b,c,d])

	y = a/25*10 + b/12*5 + c/8*20 + d/5*65
	ta.append([y])

########################################################################################

sess = tf.InteractiveSession()

# [#jumps, silver, gold, diamond]
trainingInstances = [[16,2,4,5], [22, 2,3,1], [7, 8, 1, 0], [10, 5, 1, 2], [10, 2, 1, 5]]
trainingAnswers = [[95], [73], [31], [44], [84]]

attributes = 4

trX = np.matrix(ti, dtype=float) #trainingInstances
trY = np.matrix(ta, dtype=float) #trainingAnswers
#trX = np.matrix([[16,2,4,5], [22, 2,3,1], [7, 8, 1, 0], [10, 5, 1, 2], [10, 2, 1, 5]], dtype=float)
#trY = np.matrix([[95], [73], [31], [44], [84]], dtype=float)
numInstances = trX.shape[0]

if trY.shape[0] != numInstances:
	print("nub")
	exit()

trX = trX / np.max(trX, axis=0)
trY = trY / 100


X = tf.placeholder("float", [None, attributes])
Y = tf.placeholder("float", [None, 1])

W1 = init_weights([attributes, 3]) #input layer size, hidden layer size
W2 = init_weights([3, 1]) #hidden layer size, output layer size

sess.run(tf.initialize_all_variables())
#sess.run(tf.global_variable_initializer())

py_x = model(X, W1, W2)

#cost = tf.reduce_mean(tf.square(py_x - Y))
cost = tf.reduce_sum(tf.pow(py_x-Y, 2))/(2*numInstances)
train_op = tf.train.GradientDescentOptimizer(0.5).minimize(cost) # construct an optimizer
predict_op = py_x

for step in range(0,100000):
	sess.run(train_op, feed_dict={X: trX, Y: trY})


'''initial = 5
final = sess.run(predict_op, feed_dict={X:trX})[0]
while abs(final - initial) > 0.0001:
	sess.run(train_op, feed_dict={X: trX, Y: trY})
	initial = final
	final = sess.run(predict_op, feed_dict={X:trX})[0]
	print( abs(final-initial) )
'''

def runNN(jumps, silver, gold, diamonds):
	teX = np.matrix(([jumps,silver,gold,diamonds]))
	teY = np.matrix(([0])) # doesn't matter lol
	teX = teX/np.amax(teX, axis=0)
	teY = teY/100
	return sess.run(predict_op, feed_dict={X: teX})[0,0]

# print(runNN(5,5,5,5))


