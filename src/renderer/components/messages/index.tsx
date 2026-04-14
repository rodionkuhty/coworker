import {Copy} from "@renderer/icons/copy";
import {Button} from "@renderer/components/ui/button";
import {Rotate} from "@renderer/icons/rotate";
import {Loader} from "@renderer/icons/loader.js";

type Props = {
  text: string,
  type: 'user' | 'agent' | 'update',
  id: number,
}

export function Messages ({ text, type, id}: Readonly<Props>) {
  console.log("ddd")
  return (
    <div className="flex flex-col">
      <div key={id} className={`message ${type}-message`}>
        {formatMessage(text)}
      </div>
      {type !== 'update' && (
        <div className={`flex flex-row ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
          <Button size="icon-lg" variant="ghost" className="cursor-pointer">
            <Copy className="cursor-pointer"/>
          </Button>
          <Button size="icon-lg" variant="ghost" className="cursor-pointer">
            <Rotate className="cursor-pointer"/>
          </Button>
        </div>
      )}
    </div>

  )
}

const formatMessage = (text: string) => {
  if (text.includes('```')) {
    const parts = text.split('```');
    return parts.map((part, i) => i % 2 === 0 ? <span style={{color: "red"}} key={i}>{part}</span> : <pre style={{color: "red"}} key={i}>{part}</pre>);
  }
  return text;
};