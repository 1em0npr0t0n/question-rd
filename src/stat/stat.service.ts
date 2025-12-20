import { Injectable } from '@nestjs/common';
import { AnswerService } from 'src/answer/answer.service';
import { Answer } from 'src/answer/schemas/answer.schema';
import {
  StatComponentItemDto,
  StatComponentDto,
  StatAnswerComponent,
  StatQuestionComponent,
  CheckboxComponentProps,
  RadioComponentProps,
  StatComponentCountDto,
} from './dto/stat.dto';
import { QuestionService } from 'src/question/question.service';
@Injectable()
export class StatService {
  constructor(
    private readonly answerService: AnswerService,
    private readonly questionService: QuestionService,
  ) {}
  //   genStatComponentDto(list: StatComponentItemDto[]) {
  //     return {
  //       list,
  //     };
  //   }
  genCheckboxComponentSelectedLabel(
    props: CheckboxComponentProps,
    value: string,
  ) {
    if (!value) {
      return '';
    }
    let checkedList = '';
    value.split(',').forEach((item) => {
      props.list.forEach((v) => {
        if (v.value === item) {
          if (checkedList !== '') {
            checkedList += ',' + v.label;
          } else {
            checkedList += v.label;
          }
        }
      });
    });
    return checkedList;
  }
  genRadioComponentSelectedLabel(props: RadioComponentProps, value: string) {
    if (!value) {
      return '';
    }
    let checkedList = '';
    props.options.forEach((i) => {
      if (i.value === value) {
        checkedList += i.label;
      }
    });
    return checkedList;
  }

  comboAQComponentProps(
    answerComponent: StatAnswerComponent,
    questionComponentList: StatQuestionComponent[],
  ): string {
    for (const questionComponent of questionComponentList) {
      if (questionComponent.fe_id === answerComponent.componentId) {
        if (questionComponent.type === 'questionRadio') {
          return this.genRadioComponentSelectedLabel(
            questionComponent.props as RadioComponentProps,
            answerComponent.value,
          );
        } else if (questionComponent.type === 'questionCheckbox') {
          return this.genCheckboxComponentSelectedLabel(
            questionComponent.props as CheckboxComponentProps,
            answerComponent.value,
          );
        } else {
          return answerComponent.value;
        }
      }
    }

    return answerComponent.value;
  }
  async AnswerListToStatComponent(list: Answer[], id: string) {
    const questionInfo = await this.questionService.findOne(id);
    if (!questionInfo) {
      throw new Error('question not found');
    }
    const statQuestionDtoList: StatComponentDto = { list: [] };
    //forEach 和 map 不知道哪个更好呢？
    list.forEach((item) => {
      const StatComponentItem: StatComponentItemDto = {};
      //console.log('forEach', item);
      item.answerList.forEach((i) => {
        if (i.componentId && i.value !== null && i.value !== undefined) {
          StatComponentItem[i.componentId] = this.comboAQComponentProps(
            i,
            questionInfo.componentList,
          );
        }
      });
      StatComponentItem['_id'] = item.questionId;
      statQuestionDtoList.list.push(StatComponentItem);
    });
    // list.map((item) => item.answerList).forEach((item) => {
    //   StatComponentItemDto[item.componentFeid] = item.value.join(',');
    return statQuestionDtoList;
  }
  async findComponentValues(
    questionId: string,
    componentId: string,
  ): Promise<StatComponentCountDto[]> {
    const [questionInfo, answerValues] = await Promise.all([
      this.questionService.findOne(questionId),
      this.answerService.findComponentValues(questionId, componentId),
    ]);
    const noData: StatComponentCountDto[] = [];

    if (!questionInfo || questionInfo.componentList.length === 0) {
      return noData;
    }

    // 使用for...of循环代替forEach
    for (const component of questionInfo.componentList) {
      if (component.fe_id === componentId) {
        const stat = this.genStatComponentCount(component, answerValues);
        return stat; // 这会正确返回整个findComponentValues方法
      }
    }

    return noData; // 只有在没有找到匹配组件时才会返回空数组
  }

  genStatComponentCount(
    Component: StatQuestionComponent,
    answerValues: string[],
  ) {
    const stat: StatComponentCountDto[] = [];
    if (Component.type === 'questionRadio') {
      const { options } = Component.props as RadioComponentProps;
      options.forEach((o) => {
        stat.push({
          name: o.label,
          value: o.value,
          count: answerValues.filter((v) => v === o.value).length,
        });
      });
    } else if (Component.type === 'questionCheckbox') {
      const { list } = Component.props as CheckboxComponentProps;
      list.forEach((o) => {
        stat.push({
          name: o.label,
          value: o.value,
          count: answerValues.filter((v) => v.includes(o.value)).length,
        });
      });
    }
    return stat;
  }
}
