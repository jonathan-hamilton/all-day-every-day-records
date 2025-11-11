import { useParams } from 'react-router-dom'

export default function ReleaseDetail() {
  const { id } = useParams()
  
  return (
    <div>
      <h1>Release Details</h1>
      <p>Release ID: {id}</p>
      <p>Detailed information about this specific release will be displayed here.</p>
      <p>Including track listings, artist information, streaming links, and more.</p>
    </div>
  )
}