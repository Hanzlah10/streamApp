// /**
//  * @param {number[]} nums
//  * @return {number}
//  */
// var singleNumber = function(nums) {
//     let obj = {}
//     for(let i =0; i < nums.length ;i++){
//         if(!(nums[i] in obj)){
//             obj[nums[i]] = 1
//         }
//         else {
//             obj[nums[i]] +=1
//         }
//     }
//     for(let val in obj){
//         if(obj[val]== 1){
//             console.log(val);
//             return val
//         }
//     }
// };

// let nums = [2,60,3,2,3,2]

// singleNumber(nums)


// var hammingWeight = function(n) {
//     let count = 0
//     while(n){
//         n = n & (n-1)
//         count ++
//     }
//     console.log(count);
//     return count
// };

// hammingWeight(1100111)


// var twoSum = function(nums, target) {

    // for(let i = 0; i < nums.length+1 ; i++){
    //     let j = i+1;
    //     if((nums[i]+ nums[j]) == target){
    //         console.log([i,j]);
    //         return [i,j]
    //     }
    //     else if ((nums[i]+ nums[j]) > target){
            
    //     }
    // }

//     while(i)
// };

// let nums = [3,2,3]
// console.log(nums.length);
 
// 121

// function palindrome(n){
//     let rev = 0;
//     while(n>0){
//         rev = (rev*10) +  n%10
//         n = n/10
//         console.log(rev)
//     }
    

// }


// palindrome(121)
// function isEvenPalindrome(n) {
//     // Reverse the number
//     let rev = 0;
//     while (n > 0) {
//       rev = parseInt(rev * 10 + n % 10)
//       n =n/ 10;
//       console.log(rev)
//     }
  
//     // Check if the reversed number is the same as the original number
//     return n == rev ;
//   }

//   console.log(isEvenPalindrome(121))


// var mergeAlternately = function(word1, word2) {
//     let splittedword1 = word1.split('')
//     let splittedword2 = word2.split('')
//     let  end = splittedword1.length+splittedword2.length
//     console.log(end);
//     let newWord = []

//     for(let i = 0; i<(splittedword1.length+splittedword2.length); i++){
//       if(splittedword1[i])
//       {
//         newWord.push(splittedword1[i])
//     }
//     if(splittedword2[i]){
//        newWord.push(splittedword2[i])
//     }
//     }
//     return newWord.join('')
    
// };

// var mergeAlternately = function(word1, word2) {
//     // let splittedword1 = word1.split('')
//     // let splittedword2 = word2.split('')
//     // let x = Math.max(word1.length, word2.length);
//     // console.log();
//     let newWord= ''
//     console.log(typeof newWord);

//     for(let i = 0; i<(word1.length+word2.length); i++){

//     if(word1[i]) newWord+= (word1[i])
//     if(word2[i]) newWord+= (word2[i])

//     }
//     return newWord
    
// };

// // let word1 = "abc"
// // let word2 = "pqrdfd"

// // let ans=mergeAlternately(word1, word2)
// // console.log(typeof(ans)); 


// /**
//  * @param {string} str1
//  * @param {string} str2
//  * @return {string}
//  */
// var gcdOfStrings = function(str1, str2) {
    
//     let gcd = ''
//     for(let i = 0; i<(str1.length+ str2.length); i++ ){

//         if(str1[i]==str2[i]){
//             gcd+=str1[i]
//         }
//         else break;
//     }

//     let gcdlen = gcd.length
//     if(gcdlen%2==0){
//         return gcd.substring(0,gcdlen)
//     }
    
//     return gcd
// };

// let str1 = "ABABAB" 
// let str2 = "ABA"
// console.log(gcdOfStrings(str1,str2));


// var isAnagram = function(s, t) {

//     let s1 = s.split('').sort()
//     let s2 = t.split('').sort()

//     return s1.join('') == s2.join('')
    

// };

// let s = "eas"
// let t = "sea"

// console.log(isAnagram(s,t))

/**
//  * @param {string} text1
//  * @param {string} text2
//  * @return {number}
//  */
// var longestCommonSubsequence = function(text1, text2) {
//     // let maxlen = Math.max(text1.length,text2.length)

//     let common = 0
//     for(let i = 0 ; i < text1.length ; i++){
//         for(let j = i ; j < text2.length ;j++){
//             if(text1[i] == text2[j]){
//                 common++
//             }
//         }
//     }
//     return common

// };

// console.log(longestCommonSubsequence("ezupkr","ubmrapg"));