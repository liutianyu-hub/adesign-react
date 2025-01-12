import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { CheckStatus } from '../interface';

const useCheck = (props) => {
  const {
    onCheck,
    onCheckAll,
    dataList,
    fieldNames,
    checkboxReadOnly,
    defaultCheckedKeys = [],
    checkedKeys,
  } = props;
  const [checkedNodes, setCheckedNodes] = useState<string[]>(defaultCheckedKeys);
  const [halfCheckedKeys, setHalfCheckedKeys] = useState<string[]>([]);
  const [checkedDatas, setCheckedDatas] = useState({});

  const mergeCheckedKeys = checkedKeys !== undefined ? checkedKeys : checkedNodes;

  // 获取节点选中状态
  const getNodeStatus = (nodeChild) => {
    let status = CheckStatus.UNCHECK;
    let checkedCount = 0;
    let halfCount = 0;
    let nodeCount = 0;
    Object.values(nodeChild).forEach((item) => {
      nodeCount += 1;
      if (item.checked === CheckStatus.CHECKED) {
        checkedCount += 1;
      } else if (item.checked === CheckStatus.HALFCHECK) {
        halfCount += 1;
      }
    });
    if (nodeCount > 0 && nodeCount === checkedCount) {
      status = CheckStatus.CHECKED;
    } else if (nodeCount > 0 && ((checkedCount > 0 && checkedCount < nodeCount) || halfCount > 0)) {
      status = CheckStatus.HALFCHECK;
    } else if (nodeCount > 0 && checkedCount === 0) {
      status = CheckStatus.UNCHECK;
    }
    return status;
  };

  useEffect(() => {
    const treeDatas = dataList?.reduce((a, b) => {
      const node = {};
      if (halfCheckedKeys.includes(b[fieldNames.key])) {
        node.checked = CheckStatus.HALFCHECK;
      } else if (mergeCheckedKeys.includes(b[fieldNames.key])) {
        node.checked = CheckStatus.CHECKED;
      } else {
        node.checked = CheckStatus.UNCHECK;
      }
      return { ...a, [b[fieldNames.key]]: node };
    }, {});

    // 设置parent
    const root = {};
    dataList?.forEach((d) => {
      const parent = treeDatas[d[fieldNames.parent]];
      if (parent) {
        (parent.children || (parent.children = {}))[d[fieldNames.key]] =
          treeDatas[d[fieldNames.key]];
        treeDatas[d[fieldNames.key]].parent = parent;
      }
    });
    const rootStatus = getNodeStatus(treeDatas);
    // 查询半选数据列表

    setCheckedDatas(treeDatas);
    onCheckAll(rootStatus);
  }, [dataList]);

  const updateChildStatus = (node, status) => {
    node.checked = status;
    const nodeChild = node.children;
    if (nodeChild !== undefined) {
      Object.values(nodeChild).forEach((item) => {
        updateChildStatus(item, status);
      });
    }
  };

  const updateParentStatus = (node) => {
    const nodeChild = node?.children;
    if (nodeChild !== undefined) {
      node.checked = getNodeStatus(nodeChild);
    }
    node?.parent !== undefined && updateParentStatus(node.parent);
  };

  const getCheckSummary = (newDatas) => {
    const ckdList = [];
    const halfList = [];
    Object.entries(newDatas).forEach(([nodeKey, item]) => {
      if (item.checked === CheckStatus.CHECKED) {
        ckdList.push(nodeKey);
      }
      if (item.checked === CheckStatus.HALFCHECK) {
        halfList.push(nodeKey);
      }
    });
    return {
      ckdList,
      halfList,
    };
  };

  const handleCheckNode = ({ key, checked }) => {
    if (checkboxReadOnly) {
      return;
    }
    const newDatas = _.cloneDeep(checkedDatas);
    if (checked === CheckStatus.CHECKED) {
      updateChildStatus(newDatas[key], CheckStatus.CHECKED);
    }
    if (checked === CheckStatus.UNCHECK) {
      updateChildStatus(newDatas[key], CheckStatus.UNCHECK);
    }
    updateParentStatus(newDatas[key].parent);
    const { ckdList, halfList } = getCheckSummary(newDatas);
    const rootStatus = getNodeStatus(newDatas);
    setCheckedDatas(newDatas);
    setCheckedNodes(ckdList);
    setHalfCheckedKeys(halfList);
    onCheck(ckdList);
    onCheckAll(rootStatus);
  };

  const handleCheckAll = (checkAll) => {
    if (checkboxReadOnly) {
      return;
    }
    const newDatas = _.cloneDeep(checkedDatas);
    if (checkAll) {
      const ckdList = [];
      Object.entries(newDatas).forEach(([nodeKey, item]) => {
        item.checked = CheckStatus.CHECKED;
        ckdList.push(nodeKey);
      });
      setCheckedDatas(newDatas);
      setCheckedNodes(ckdList);
      setHalfCheckedKeys([]);
      onCheck(ckdList);
      onCheckAll(CheckStatus.CHECKED);
    } else {
      Object.values(newDatas).forEach((item) => {
        item.checked = CheckStatus.UNCHECK;
      });
      setCheckedDatas(newDatas);
      setCheckedNodes([]);
      setHalfCheckedKeys([]);
      onCheck([]);
      onCheckAll(CheckStatus.UNCHECK);
    }
  };

  return {
    mergeCheckedKeys,
    halfCheckedKeys,
    handleCheckNode,
    handleCheckAll,
  };
};

export default useCheck;
