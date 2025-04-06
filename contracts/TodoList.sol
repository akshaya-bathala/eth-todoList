// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {
    uint public taskCount = 0;


    struct Task {
        uint id;
        string content;
        bool complete;
    }

    mapping(uint => Task) public tasks;


    constructor() public {
        createTask("Finish the vedio for sure");
    }


    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
    }


}