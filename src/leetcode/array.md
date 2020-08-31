
# 数组
选择 数组 tag标签，难度；简单 => 中等 => 困难，倒叙更新

## 35. 搜索插入位置（简单）
```js
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

你可以假设数组中无重复元素。

示例 1:

输入: [1,3,5,6], 5
输出: 2
示例 2:

输入: [1,3,5,6], 2
输出: 1
示例 3:

输入: [1,3,5,6], 7
输出: 4
示例 4:

输入: [1,3,5,6], 0
输出: 0

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/search-insert-position
```
解题，较简单
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  //  for (let i = 0, len = nums.length; i < len; i++) {
  //       // 如果当前遍历值大等于目标值
  //       if (nums[i] >= target) {
  //           return i
  //       } else  {
  //         // 当前遍历值小于目标值，且是最后一个元素
  //         if (i === len - 1) {
  //           return len
  //         }
  //       }
  //   }

    // 优化 80ms
    for (let i = 0, len = nums.length; i < len; i++) {
        // 如果当前遍历值大等于目标值
        if (nums[i] >= target) {
            return i
        } else if(i === len - 1) {
          // 当前遍历值小于目标值，且是最后一个元素
          return len
        }
    }
};
```

## 27. 移除元素（简单）
```js
给你一个数组 nums 和一个值 val，你需要 原地 移除所有数值等于 val 的元素，并返回移除后数组的新长度。

不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并 原地 修改输入数组。

元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

 

示例 1:

给定 nums = [3,2,2,3], val = 3,

函数应该返回新的长度 2, 并且 nums 中的前两个元素均为 2。

你不需要考虑数组中超出新长度后面的元素。
示例 2:

给定 nums = [0,1,2,2,3,0,4,2], val = 2,

函数应该返回新的长度 5, 并且 nums 中的前五个元素为 0, 1, 3, 0, 4。

注意这五个元素可为任意顺序。

你不需要考虑数组中超出新长度后面的元素。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/remove-element
```
解题

看答案后的写法，思路很巧妙：
1. 用一个变量 i = 0 来标记不等于val的数量 
2. 遍历nums, 指针为j，如果 nums[j] 不等于 val，设置 nums[i] 的值为 nums[j], i++ 这里用i来标记实际值，j用来跳过等于值的val的下标

```js
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    // 88ms
    // let ans = 0;
    // for(const num of nums) {
    //     if(num != val) {
    //         nums[ans] = num;
    //         ans++;
    //     }
    // }
    // return ans;

    // 84ms
    let i = 0
    for (let j = 0, len = nums.length; j < len; j++) {
        if (nums[j] !== val) {
            nums[i] = nums[j]
            i++
        }
    }
    return i
};
```
之前自己的写法
```js
/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
    // 思路 [0,1,2,2,3,0,4,2] 2
    // 遍历，如果发现等于2的，用指针j找到后面一个不等于2的元素，
    // 赋值给当前遍历的元素，不等于2的元素由于用了，将它赋值为2
    // 每次遍历j都加1，如果j = 数组长度，j就不加了，然后置换的值就都是undefined
    // 有多少undefined，就有多少等于 2 的，用数组长度以减就可以了
    let j = 1
    let len = nums.length
    let equalValCount = 0
    for (let i = 0; i < len; i++) {
        if (nums[i] === val) {
            // 如果是最后一个元素
            if (i === len - 1) {
                nums[i] = undefined
            } else {
                for(; j < len; j++) {
                    if (nums[j] !== val) {
                        break
                    }
                }
                if (j !== len) {
                    nums[i] = nums[j]
                    nums[j] = val
                    j++
                } else {
                    nums[i] = nums[j]
                }
            }
        } else {
            j++
        }
        if (nums[i] === undefined) {
            equalValCount++
        }
    }
    return len - equalValCount
};
```
## 26. 删除排序数组中的重复项（简单）
```js
给定一个排序数组，你需要在 原地 删除重复出现的元素，使得每个元素只出现一次，返回移除后数组的新长度。
不要使用额外的数组空间，你必须在 原地 修改输入数组 并在使用 O(1) 额外空间的条件下完成。

示例 1:

给定数组 nums = [1,1,2], 

函数应该返回新的长度 2, 并且原数组 nums 的前两个元素被修改为 1, 2。 

你不需要考虑数组中超出新长度后面的元素。
示例 2:

给定 nums = [0,0,1,1,1,2,2,3,3,4],

函数应该返回新的长度 5, 并且原数组 nums 的前五个元素被修改为 0, 1, 2, 3, 4。

你不需要考虑数组中超出新长度后面的元素。

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/remove-duplicates-from-sorted-array
```
解法
```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var removeDuplicates = function(nums) {
    // 方法1，使用splice原地删除
    // for (let i = 0; i < nums.length; i++) {
    //     if (nums[i] === nums[i+1]) {
    //         nums.splice(i, 1)
    //         i--
    //     }
    // }
    // return nums.length

    // 方法二，双指针法
    // 输入：[0,0,1,1,1,2,2,3,3,4]
    // 输出：[0, 1, 2, 3, 4, 2, 2, 3, 3, 4]
    // 快指针遍历，慢指针赋值
    // let i = 0;
    // for (let j = 1; j < nums.length; j++) {
    //     if (nums[j] !== nums[i]) {
    //         nums[i + 1] = nums[j]
    //         i++
    //     }
    // }
    // return i + 1

    // 优化
    // len = nums.length 放到第一位，和放到中间会有ms级优势
    let i = 1;
    for (let j = 1, len = nums.length; j < len; j++) {
        if (nums[j] !== nums[i-1]) {
            nums[i++] = nums[j]
        }
    }
    return i
};
```
## 1. 两数之和 (简单)

```js
给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那 两个 整数，并返回他们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

示例:

给定 nums = [2, 7, 11, 15], target = 9

因为 nums[0] + nums[1] = 2 + 7 = 9
所以返回 [0, 1]

来源：力扣（LeetCode）
链接：https://leetcode-cn.com/problems/two-sum
```
解法
```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // 方法1
    // for(let i = 0; i < nums.length - 1; i++) {
    //     for (let j = i + 1; j < nums.length; j++) {
    //         if (nums[i] + nums[j] === target) {
    //             return [i, j]
    //             break
    //         }
    //     }
    // }

    // 多一个obj，[2,7,11,15]
    // 空间换时间
    let obj = {}
    for (let i = 0, len = nums.length; i < len; i++) {
        if (obj[nums[i]]) {
            return [obj[nums[i]].index, i]
        } else {
            obj[target - nums[i]] = {index: i}
        }
    }
};
```