"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function JobTypeSelect() {
  return (
        <Select name="job-type">
            <SelectTrigger className="border rounded-lg p-2 w-full">
            <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="fulltime">Full-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="parttime">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
            </SelectContent>
        </Select>
  )
}
