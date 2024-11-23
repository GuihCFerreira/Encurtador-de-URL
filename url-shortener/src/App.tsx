import { CalendarIcon, Link } from "lucide-react";
import "./App.css";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "./components/ui/calendar";

interface Request {
  originalUrl: string;
  expirationDate: number;
}

function App() {
  const [date, setDate] = useState<Date>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [requestValues, setRequestValues] = useState<Request>();

  const formSchema = z.object({
    originalUrl: z.string().min(5, {
      message: "A URL deve ter pelo menos 5 caracteres",
    }),
    expirationDate: z.number().int().positive({
      message: "Selecione uma data de expiração para a URL",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalUrl: "",
      expirationDate: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    setRequestValues(values);
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">URL original</Label>
          <Input type="email" id="email" placeholder="Email" />
        </div>

        <Label htmlFor="calendar">Data de expiração</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full max-w-sm justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? (
                format(date, "PPP", { locale: ptBR })
              ) : (
                <span>Selecione uma data</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
            <Select
              onValueChange={(value) =>
                setDate(addDays(new Date(), Number.parseInt(value)))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma data" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="0">Hoje</SelectItem>
                <SelectItem value="1">Amanhã</SelectItem>
                <SelectItem value="3">Em 3 dias</SelectItem>
                <SelectItem value="7">Em 1 semana</SelectItem>
                <SelectItem value="14">Em 2 semanas</SelectItem>
                <SelectItem value="30">Em 1 mês</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-md border">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                id="calendar"
              />
            </div>
          </PopoverContent>
        </Popover> 

        <Button>Encurtar URL</Button>*/}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="originalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL original</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center">
                    <Input
                      placeholder="www.google.com"
                      className="w-full max-w-sm justify-start text-left font-normal"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de expiração</FormLabel>
                <FormControl>
                  <div>
                    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          onClick={() => setPopoverOpen(!popoverOpen)}
                          variant={"outline"}
                          className={cn(
                            "w-full max-w-sm justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon />
                          {date ? (
                            format(date, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                        <Select
                          onValueChange={(value) => {
                            const selectedDate = addDays(
                              new Date(),
                              Number.parseInt(value)
                            );
                            selectedDate.setUTCHours(23, 59, 59, 999);
                            setDate(selectedDate);
                            field.onChange(
                              Math.floor(selectedDate.getTime() / 1000)
                            );
                            setPopoverOpen(false);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma data" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            <SelectItem value="0">Hoje</SelectItem>
                            <SelectItem value="1">Amanhã</SelectItem>
                            <SelectItem value="3">Em 3 dias</SelectItem>
                            <SelectItem value="7">Em 1 semana</SelectItem>
                            <SelectItem value="14">Em 2 semanas</SelectItem>
                            <SelectItem value="30">Em 1 mês</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="rounded-md border">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              setDate(selectedDate);
                              selectedDate?.setUTCHours(23, 59, 59, 999);
                              field.onChange(
                                selectedDate !== undefined &&
                                  Math.floor(selectedDate?.getTime() / 1000)
                              );
                              setPopoverOpen(false);
                            }}
                            locale={ptBR}
                            id="calendar"
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="p-5">
            <Button type="submit" className="px-5">
              Encurtar URL
              <Link />
            </Button>
          </div>
        </form>
      </Form>
      <div>{requestValues?.expirationDate}</div>
    </>
  );
}

export default App;
