# How to run the code
0. Prerequisite: [npm](https://nodejs.org/en/download/)  must be installed on your system
1. Run the command "npm install". This will install the two dependencies of the program.
2. Input csv file is assumed to be named as "volunteer_attendance_data.csv".
3. Run the file named "sol.js". This will place the output in a file named as "output.csv"

# Approach to solve the problem
1. First of all input csv file is parsed and stored in an array of objects
2. The array of objects is sorted firstly based on "date" and then based on "shift"
3. So, after sorting the array all the volunteers worked on the same shift on a certain day are adjacent to one another.
4. I've used adjacency matrix to solve the problem.
5. Each entry in the adjacency matrix specifies the weight of connection(how many times they have worked together in the same shift in a day) between the corresponding volunteer in the column and the corresponding volunteer in the row.
6. Now, one by one take the volunteers who worked in the same shift and on the same day from the sorted array of objects and increment their corresponding entry. This signifies that the two volunteers have worked on the same shift on a particular day.
7. After the completion of step 6, we will have a adjacency matrix where each entry specifies the weight of corresponding volunteers.

# Challenges faced and limitations 
1. The run time complexity of the solution is O(n^2) where n is the maximum number of volunteers on the same shift on a particular day. This is the main challenge that I faced while I was trying to make the solution more efficient. This is one of the limitations too.
2. As I've used adjacency matrix, there is a limitation on the total number of unique volunteers. The maximum number of unique volunteers is approximately 100,000. I could have used adjacency matrix but that would not improve the worst case run time complexity of the solution.