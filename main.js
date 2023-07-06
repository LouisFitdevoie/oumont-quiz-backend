/*
Read file
File name: groupNames.txt
File content: the names of the groups that participates at the event with one group name per line

.env file: var to contain the number of people per group, file path to the group names file, file path to the questions file

Function: read file
Function: create a group object for each group name with the following properties: uuid, name, number of points. Then add the group object to an array of groups
Function: select a random group from the list of groups, each time a group is selected, remove it from the list, if the list is empty then copy the content of the array of groups created by the function above
*/
