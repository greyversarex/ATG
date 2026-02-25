import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ShoppingCart, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productIds: string[];
  productNames?: string[];
}

export function OrderModal({ open, onOpenChange, productIds, productNames }: OrderModalProps) {
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/orders", {
      phone,
      comment: comment || null,
      productIds,
    }),
    onSuccess: () => {
      setSuccess(true);
    },
    onError: () => {
      toast({ title: "Ошибка при отправке заявки", variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!phone.trim()) {
      toast({ title: "Введите номер телефона", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  const handleClose = (val: boolean) => {
    if (!val) {
      setPhone("");
      setComment("");
      setSuccess(false);
      mutation.reset();
    }
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Заявка отправлена!</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Мы свяжемся с вами в ближайшее время по указанному номеру телефона.
              </DialogDescription>
            </DialogHeader>
            <Button className="mt-6" onClick={() => handleClose(false)} data-testid="button-order-close">
              Закрыть
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Оформить заявку
              </DialogTitle>
              <DialogDescription>
                Оставьте ваш номер телефона, и мы свяжемся с вами для подтверждения заказа.
              </DialogDescription>
            </DialogHeader>
            {productNames && productNames.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-3 text-sm">
                <p className="font-medium mb-1">Товары ({productNames.length}):</p>
                <ul className="space-y-0.5 text-muted-foreground">
                  {productNames.map((name, i) => (
                    <li key={i} className="truncate">• {name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Номер телефона *</label>
                <Input
                  placeholder="+992 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  data-testid="input-order-phone"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Комментарий</label>
                <Textarea
                  placeholder="Дополнительная информация к заказу..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  data-testid="input-order-comment"
                />
              </div>
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={mutation.isPending}
                data-testid="button-submit-order"
              >
                {mutation.isPending ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Отправка...</>
                ) : (
                  "Отправить заявку"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
