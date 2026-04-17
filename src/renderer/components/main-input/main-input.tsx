import { ChangeEvent, KeyboardEvent } from "react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@renderer/components/ui/input-group"
import { SendHorizonal, CirclePlus, Maximize} from "lucide-react"

type Props = {
  placeholder: string,
  value: string,
  disabled: boolean,
  autoFocus: boolean,
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void,
  onSend: () => void,
}

export function MainInput({
  onChange,
  onKeyDown,
  autoFocus,
  value,
  disabled,
  placeholder,
  onSend
}: Readonly<Props>) {
  return (
    <div className="grid w-full min-w-4/6 max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea
          id="textarea-code-32"
          placeholder={placeholder}
          className="min-h-20"
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoFocus={autoFocus}
          value={value}
        />
        <InputGroupAddon align="block-end" >
          <div className="flex items-center">
            <InputGroupButton  disabled={disabled || !value.trim()} size="icon-sm" className="ml-auto" variant="ghost">
              <CirclePlus />
            </InputGroupButton>
          </div>
          <InputGroupButton onClick={onSend} disabled={disabled || !value.trim()} size="icon-sm" className="ml-auto" variant="ghost">
            <SendHorizonal  />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
