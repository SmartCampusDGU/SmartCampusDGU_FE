import Button from '@/components/ui/Button'  // 별칭(alias) 적용된 경우
// 별칭 안 쓰면 -> import Button from './components/ui/Button'

function App() {
  const handleSave = () => {
    alert('저장하기 버튼 클릭!')
  }

  const handleRegister = () => {
    alert('등록하기 버튼 클릭!')
  }

  const handleDelete = () => {
    alert('삭제하기 버튼 클릭!')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-gray-50">
      <Button variant="save" onClick={handleSave} />
      <Button variant="register" onClick={handleRegister} />
      <Button variant="delete" onClick={handleDelete} />
    </div>
  )
}

export default App
