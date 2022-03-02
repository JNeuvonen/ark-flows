import { GetEmojiIcon } from '../../utils/functions'

const SymbolMiniTitle = ({ title }) => {
  const emoji = GetEmojiIcon(title)
  return (
    <div className="symbol__grid__mini-title">
      <div className="symbol__grid__mini-title__icon">{emoji}</div>
      {title}
    </div>
  )
}

export default SymbolMiniTitle
