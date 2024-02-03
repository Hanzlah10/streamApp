

# my_list = [1, 2, 3]

# new_list = [my_list[i:i+2] for i in range(len(my_list)-1)]

# new_list.append([my_list[0], my_list[-1]])

# print(new_list)

# my_list = ['hello', 'world']

# new_list = list(map(list, my_list))

# new_list[0][1] = 'i'

# print(my_list)


# my_dict = {'a': {'b': {'c': 1}}}

# # What is the output of the following code?

# print(my_dict['a']['b'].get('c', {}).get('d', ''))

my_dict = {'a': {'b': 1, 'c': 2}, 'd': {'e': 3, 'f': 4}}

# What is the output of the following code?

print(my_dict.get('a', {}).get('d', ''))
