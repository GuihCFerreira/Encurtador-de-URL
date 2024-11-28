import {
  AlertTriangle,
  CalendarIcon,
  Check,
  Copy,
  Link,
  SquareArrowOutUpRight,
} from "lucide-react";
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
import { createShortUrl } from "./functions/create-short-url";
import { ShortUrlResponse } from "./model/short-url-response";
import { Spinner } from "./components/ui/spinner";
import { Card, CardContent } from "./components/ui/card";
import { toast } from "sonner";

function App() {
  const [date, setDate] = useState<Date>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [urlCode, setUrlCode] = useState<ShortUrlResponse>();
  const [loading, setLoading] = useState(false);

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const response: ShortUrlResponse = await createShortUrl({
      originalUrl: values.originalUrl,
      expirationTime: values.expirationDate.toString(),
    });
    if (response != null) {

      if(response.message) toast.error(`Erro ao encurtar URL:  ${response.message}`);
      if(response.code) toast.success(`Sucesso ao encurtar URL!`);

      setUrlCode(response);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6  w-full items-center">
      <h1 className="text-3xl font-bold text-[#FFB936] mb-8">Encurtador de URL</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-full"
        >
          <FormField
            control={form.control}
            name="originalUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-txt-color text-base">URL original</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center">
                    <Input
                      placeholder="www.google.com"
                      className="w-full max-w-sm justify-start text-left font-normal bg-popover"
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
                <FormLabel className="text-txt-color text-base">Data de expiração</FormLabel>
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
            <Button type="submit" className="px-5 bg-accent-color hover:bg-secondary-color">
              Encurtar URL
              <Link />
            </Button>
          </div>
        </form>
      </Form>
      <div className="m-3">
        <Spinner show={loading} className="text-[#FFB936]" />
        {urlCode?.code ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="text-center flex gap-3">
              <Check className="text-green-700" />
              <p className="text-green-500" >Sucesso ao encurtar a URL!</p>
            </div>
            <Card className="bg-gray-200 flex items-center">
              <CardContent className="flex gap-3 items-center justify-center py-2 px-4">
                <p>
                  {import.meta.env.VITE_BASE_API_URL}/{urlCode.code}
                </p>
                <SquareArrowOutUpRight
                  className="hover:cursor-pointer hover:text-accent-color"
                  onClick={() =>
                    window.open(
                      `${import.meta.env.VITE_BASE_API_URL}/${urlCode.code}`,
                      "_blank"
                    )
                  }
                />
              </CardContent>
            </Card>

            <Button
              className="bg-accent-color hover:bg-secondary-color"
              onClick={() => {
                navigator.clipboard.writeText(
                  `${import.meta.env.VITE_BASE_API_URL}/${urlCode.code}`
                );
                toast.success("URL copiada para a área de transferência");
              }}
            >
              Copiar
              <Copy />
            </Button>
          </div>
        ) : (
          <>
            {urlCode?.message && (
              <div className="text-center flex gap-3">
                <AlertTriangle className="text-red-700 " />
                <p className="text-red-500 ">Erro ao encurtar a URL! ${urlCode.message}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
