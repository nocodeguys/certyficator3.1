'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { UserCircle, Building2, Calendar } from 'lucide-react'

export default function CertificateForm() {
  const [formData, setFormData] = useState({
    participantName: '',
    courseName: '',
    courseDescription: '',
    authorName: '',
    completionDate: '',
    companyLogo: null as File | null,
  })
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, companyLogo: e.target.files[0] })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!formData.participantName || !formData.courseName || !formData.completionDate) {
      setError('Participant Name, Course Name, and Completion Date are required')
      return
    }

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value)
        }
      })

      const response = await fetch('/api/certificates', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create certificate')
      }

      const data = await response.json()
      router.push(`/certificates/${data.id}`)
    } catch (err) {
      console.error('Error:', err)
      setError('An error occurred. Please try again.')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            <TabsTrigger value="webhook">Webhook</TabsTrigger>
          </TabsList>
          <TabsContent value="manual">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="participantName">Participant Name</Label>
                <div className="relative">
                  <Input
                    type="text"
                    id="participantName"
                    name="participantName"
                    value={formData.participantName}
                    onChange={handleChange}
                    placeholder="Enter participant name"
                    className="pl-10"
                    required
                  />
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  type="text"
                  id="courseName"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleChange}
                  placeholder="Enter course name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="courseDescription">Course Description</Label>
                <Textarea
                  id="courseDescription"
                  name="courseDescription"
                  value={formData.courseDescription}
                  onChange={handleChange}
                  placeholder="Enter course description"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authorName">Author Name</Label>
                <div className="relative">
                  <Input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="Enter author name"
                    className="pl-10"
                  />
                  <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="completionDate">Completion Date</Label>
                <div className="relative">
                  <Input
                    type="date"
                    id="completionDate"
                    name="completionDate"
                    value={formData.completionDate}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyLogo">Company Logo</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    id="companyLogo"
                    name="companyLogo"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('companyLogo')?.click()}
                    className="w-full justify-start"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    {formData.companyLogo ? formData.companyLogo.name : 'Select file'}
                  </Button>
                  {formData.companyLogo && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setFormData({ ...formData, companyLogo: null })}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#14161A] text-white">
                Generate Certificate
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </TabsContent>
          <TabsContent value="webhook">
            <div className="p-4 text-center text-gray-500">
              Webhook functionality is not implemented yet.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

