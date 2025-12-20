/**
 * 
            "list": [
            {
                "_id": "69466ceee03661e514b3f0ad",
                "questionId": "69466ca6e03661e514b3f084",
                "answerList": [
                    {
                        "componentId": "5Vo5KkDFZsvMtUmnHX6KH",
                        "value": "反倒"
                    },
                    {
                        "componentId": "RegqWGPBfGPyeQDUt5Q1R",
                        "value": "发多少"
                    },
                    {
                        "componentId": "lvynLGLFAZcj7-Basspna",
                        "value": "item2"
                    },
                    {
                        "componentId": "OO4e2H223l-HAD_kAZb9i",
                        "value": "item2"
                    }
                ],
                "__v": 0
            },
        ]  to
          list": [
            {
                "_id": "360000200801038745",
                "q3": "社确总世细",
                "q4": "名对象特更",
                "q5": "队委京明非",
                "q7": "不",
                "q8": "哈哈,必须喝"
            },

] 
 */
export interface StatComponentDto {
  list: StatComponentItemDto[];
}
export interface StatComponentItemDto {
  [key: string]: string;
}
