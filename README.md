# ![Capital Juan](https://github.com/ericmdai/CapitalJuan/blob/master/assets/branding/logo2.png)

## jRun
### About
Our hackathon project for Carbon 2017 - Capital One's annual Tech Internship Hackathon. jRun (jackson-Rune) is a simple, lightweight running-platform game that collect information about gameplay and uses it to access a real life risk-index about the customer's behavior and spending habits. The game is easy to play and cross-platform.
We do this by giving the user different scenarios where they will have to choose between risky paths
in return for more valuable gems. 

### Purpose/Vision
- Banks need data in order to better serve customers
- Banks can use this to determine whether the product the customer needs from the bank is
suitable and if the return outweighs the risk.
- Banks can better assess customers and their habits

Our vision is to give customers the option to play the game on a loading screen or 404 page on Capital One's site. A nonchalant but fun way to easily collect data. <br><br><i>"Real data is found when it is least expected"</i><br>

### Algorithm
Our algorithm has nothing to do with the success of the player. Instead, we keep track of which gems they
attempt to get, how many jumps they perform, and the speed where they chose these behaviors. Customers can only play once per qualified page in order to increase the validity of the data.
A neural network is trained using data from loyal, long-time customers that are previously labeled with our risk index. 
New customers will then be given the option to play the game. Their data is then tested on the neural network in order to give banks the data they need.
<br>
Our neural network is implemented with TensorFlow and deployed on an EC2 instance in AWS.

## Developers
Eric Dai
Felix Park
Omar Baradei
Juan Alonso Cruz

<i>" Juan's in your wallet {?, !} "</i>




