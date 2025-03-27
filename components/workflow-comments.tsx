"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, CheckCircle, Edit, Trash2, Reply } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import {
  getWorkflowComments,
  addWorkflowComment,
  updateWorkflowComment,
  deleteWorkflowComment,
  toggleCommentResolved,
  type WorkflowComment,
} from "@/lib/team-workspace"
import { formatDistanceToNow } from "date-fns"

interface WorkflowCommentsProps {
  workflowId: string
}

export default function WorkflowComments({ workflowId }: WorkflowCommentsProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<WorkflowComment[]>([])
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editContent, setEditContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (workflowId) {
      const workflowComments = getWorkflowComments(workflowId)
      setComments(workflowComments)
    }
  }, [workflowId])

  const handleAddComment = () => {
    if (!user || !newComment.trim()) return

    setIsSubmitting(true)

    try {
      const comment = addWorkflowComment(workflowId, user.email, user.email, newComment)

      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReply = (parentId: string) => {
    if (!user || !replyContent.trim()) return

    setIsSubmitting(true)

    try {
      const comment = addWorkflowComment(workflowId, user.email, user.email, replyContent, parentId)

      setComments([...comments, comment])
      setReplyingTo(null)
      setReplyContent("")
    } catch (error) {
      console.error("Error adding reply:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateComment = (commentId: string) => {
    if (!editContent.trim()) return

    try {
      const updatedComment = updateWorkflowComment(workflowId, commentId, editContent)

      if (updatedComment) {
        setComments(comments.map((c) => (c.id === commentId ? updatedComment : c)))
      }

      setEditingComment(null)
      setEditContent("")
    } catch (error) {
      console.error("Error updating comment:", error)
    }
  }

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        deleteWorkflowComment(workflowId, commentId)
        setComments(comments.filter((c) => c.id !== commentId))
      } catch (error) {
        console.error("Error deleting comment:", error)
      }
    }
  }

  const handleToggleResolved = (commentId: string) => {
    try {
      const updatedComment = toggleCommentResolved(workflowId, commentId)

      if (updatedComment) {
        setComments(comments.map((c) => (c.id === commentId ? updatedComment : c)))
      }
    } catch (error) {
      console.error("Error toggling comment resolved status:", error)
    }
  }

  // Group comments by parent/child relationship
  const topLevelComments = comments.filter((c) => !c.parentId)
  const getChildComments = (parentId: string) => comments.filter((c) => c.parentId === parentId)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <CardTitle>Comments</CardTitle>
          </div>
          <Badge>{comments.length}</Badge>
        </div>
        <CardDescription>Discuss and provide feedback on this workflow</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {topLevelComments.length > 0 ? (
          <div className="space-y-6">
            {topLevelComments.map((comment) => (
              <div
                key={comment.id}
                className={`border border-border rounded-lg p-4 ${comment.resolved ? "bg-green-500/5 border-green-500/20" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {comment.userEmail.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.userEmail}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        {comment.updatedAt && " (edited)"}
                      </div>
                    </div>
                  </div>

                  {comment.resolved && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Resolved
                    </Badge>
                  )}
                </div>

                {editingComment === comment.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingComment(null)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm">{comment.content}</div>
                )}

                {/* Comment actions */}
                {!editingComment && user && (
                  <div className="flex items-center gap-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs gap-1"
                      onClick={() => {
                        setReplyingTo(comment.id)
                        setReplyContent("")
                      }}
                    >
                      <Reply className="h-3 w-3" />
                      Reply
                    </Button>

                    {user.email === comment.userId && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1"
                          onClick={() => {
                            setEditingComment(comment.id)
                            setEditContent(comment.content)
                          }}
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs gap-1 text-red-500"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      className={`text-xs gap-1 ${comment.resolved ? "text-green-500" : ""}`}
                      onClick={() => handleToggleResolved(comment.id)}
                    >
                      <CheckCircle className="h-3 w-3" />
                      {comment.resolved ? "Unresolve" : "Resolve"}
                    </Button>
                  </div>
                )}

                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 pl-6 border-l-2 border-border">
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyContent.trim() || isSubmitting}
                        >
                          {isSubmitting ? "Submitting..." : "Reply"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Child comments */}
                {getChildComments(comment.id).length > 0 && (
                  <div className="mt-4 pl-6 border-l-2 border-border space-y-4">
                    {getChildComments(comment.id).map((childComment) => (
                      <div key={childComment.id} className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                {childComment.userEmail.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{childComment.userEmail}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(childComment.createdAt), { addSuffix: true })}
                                {childComment.updatedAt && " (edited)"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 text-sm">{childComment.content}</div>

                        {/* Child comment actions */}
                        {user && user.email === childComment.userId && (
                          <div className="flex items-center gap-4 mt-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs gap-1"
                              onClick={() => {
                                setEditingComment(childComment.id)
                                setEditContent(childComment.content)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                              Edit
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs gap-1 text-red-500"
                              onClick={() => handleDeleteComment(childComment.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No comments yet. Be the first to comment!</div>
        )}
      </CardContent>

      <CardFooter className="border-t border-border pt-4">
        <div className="w-full space-y-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button onClick={handleAddComment} disabled={!newComment.trim() || isSubmitting} className="gap-2">
              <Send className="h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Comment"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

