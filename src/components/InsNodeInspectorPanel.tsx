import { CSSProperties, ReactNode, useState } from "react";
import * as Nodes from '../mock/data-nodes.json';
import * as Links from '../mock/data-links.json';
import { styleList } from "../utils/createGraph";
import _ from 'lodash';

interface HeaderProps {
    title: string;
}

interface BlockProps {
    text: string;
    color: string;
    bgColor: string;
    style?: CSSProperties;
    children: ReactNode;
}
// 标题栏
const Header = ({ title }: HeaderProps) => <h1>{title}</h1>

// 单项元素
const Block = ({ text, color, bgColor, style, children }: Partial<BlockProps>) => <div style={{ color, backgroundColor: bgColor, ...style }}>{text}{children}</div>
// 控制面板
export default function InsNodeInspectorPanel() {
    // node labels
    const [labels, setLabels] = useState<string[]>([]);
    const data = [{ "id": "0", "labels": ["PORT"], "properties": { "state_reason": "syn-ack", "protocol": "tcp", "port_id": "7100", "state": "open" } }, { "id": "1", "labels": ["SEED"], "properties": { "state_reason": "syn-ack", "protocol": "tcp", "port_id": "10000", "state": "open" } }, { "id": "2", "labels": ["OS"], "properties": { "name": "Tomato firmware (Linux 2.6.22)" } }, { "id": "3", "labels": ["SERVICE"], "properties": { "name": "ssh" } }, { "id": "4", "labels": ["OS"], "properties": { "name": "FreeBSD 5.4-RELEASE" } }, { "id": "5", "labels": ["Node"], "properties": { "name": "node1" } }];
    const labelNodes = _.groupBy(data, (v: { labels: any; }) => v.labels)
    setLabels([`*(${data.length})`, ...Object.entries(labelNodes).map((v: any) => `${v[0]}(${v[1].length})`)])
    
    // relationship types
    const [types, setTypes] = useState<string[]>([]);

    return <>
        <Header title="Node labels" />
        {labels.map(v => {
            <Block text={v}  />
        })}
        <Header title="Relationship Types" />

    </>
}
