'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getVietnameseDishStatus, handleErrorApi } from '@/lib/utils'
import { CreateDishBody, CreateDishBodyType } from '@/schemaValidations/dish.schema'
import { DishStatus, DishStatusValues } from '@/constants/type'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateDishMutation } from '@/queries/useDish'
import { useUploadMediaMutation } from '@/queries/useMedia'
import { toast } from 'sonner'
import revalidateApiRequest from '@/apiRequests/revalidate'
import { useRouter } from '@/i18n/navigation'

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null)
  const [open, setOpen] = useState(false)
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const createDishMutation = useCreateDishMutation()
  const uploadMediaMutation = useUploadMediaMutation()

  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: undefined,
      status: DishStatus.Unavailable
    }
  })
  const image = form.watch('image')
  const name = form.watch('name')
  const [previewAvatarFromFile, setPreviewAvatarFromFile] = useState<string | undefined>(undefined)
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewAvatarFromFile(objectUrl)

      return () => URL.revokeObjectURL(objectUrl)
    } else {
      setPreviewAvatarFromFile(image)
    }
  }, [file, image])

  const onReset = () => {
    form.reset()
    setFile(null)
  }

  const onSubmit = async (body: CreateDishBodyType) => {
    if (createDishMutation.isPending) return

    try {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        const uploadRes = await uploadMediaMutation.mutateAsync(formData)
        body.image = uploadRes.payload.data
      }
      const res = await createDishMutation.mutateAsync(body)
      await revalidateApiRequest('dishes')
      router.refresh()
      toast.success(res.payload.message)
      setOpen(false)
      onReset()
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError
      })
    }
  }

  return (
    <Dialog
      onOpenChange={(value) => {
        setOpen(value)
        if (value) {
          onReset()
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size='sm' className='h-7 gap-1'>
          <PlusCircle className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>Thêm món ăn</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px] max-h-screen overflow-auto'>
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className='grid auto-rows-max items-start gap-4 md:gap-8'
            id='add-dish-form'
            onSubmit={form.handleSubmit(onSubmit)}
            onReset={onReset}
          >
            <div className='grid gap-4 py-4'>
              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <div className='flex gap-2 items-start justify-start'>
                      <Avatar className='aspect-square w-[100px] h-[100px] rounded-md object-cover'>
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className='rounded-none'>{name || 'Avatar'}</AvatarFallback>
                      </Avatar>
                      <input
                        type='file'
                        accept='image/*'
                        ref={imageInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setFile(file)
                            field.onChange('http://localhost:3000/' + file.name)
                          }
                        }}
                        className='hidden'
                      />
                      <button
                        className='flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed'
                        type='button'
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className='h-4 w-4 text-muted-foreground' />
                        <span className='sr-only'>Upload</span>
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='name'>Tên món ăn</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input id='name' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='price'>Giá</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Input
                          id='price'
                          className='w-full'
                          {...field}
                          type='number'
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='description'>Mô tả sản phẩm</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Textarea id='description' className='w-full' {...field} />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <div className='grid grid-cols-4 items-center justify-items-start gap-4'>
                      <Label htmlFor='description'>Trạng thái</Label>
                      <div className='col-span-3 w-full space-y-2'>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn trạng thái' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseDishStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type='submit' form='add-dish-form'>
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
