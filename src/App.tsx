import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Calculator, CreditCard, TrendingUp } from 'lucide-react';

const PaymentCalculator = () => {
  function getCurrentYear(): number {
    return new Date().getFullYear();
  }

  const DEFAULT_SHIPPING = 14.90;

  const [platform, setPlatform] = useState('payt');
  const [amount, setAmount] = useState<number | null>(null);
  const [includeShipping, setIncludeShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState<number | null>(null);

  // Função para lidar com a mudança do switch de frete
  const handleShippingToggle = (checked: boolean) => {
    setIncludeShipping(checked);
    setShippingCost(checked ? DEFAULT_SHIPPING : null);
  };

  // Payt fees
  const paytFees = {
    '1': 0, // Taxa de 0% para pagamento à vista
    '2': 4.51,
    '3': 6.036,
    '4': 7.58,
    '5': 9.15,
    '6': 10.72,
    '7': 12.31,
    '8': 13.92,
    '9': 15.548,
    '10': 17.19,
    '11': 18.786,
    '12': 20.48,
  };

  const calculateInstallment = (totalAmount: number, installments: number, fee: number) => {
    const feeDecimal = fee / 100;
    const baseAmount = totalAmount;
    const shippingAmount = includeShipping && shippingCost !== null ? shippingCost : 0;
    const totalWithShipping = baseAmount + shippingAmount;
    const totalWithFee = totalWithShipping * (1 + feeDecimal);

    // Divisão das parcelas
    const installmentAmount = Math.round((totalWithFee / installments) * 100) / 100;

    return {
      installmentValue: installmentAmount,
      totalAmount: totalWithFee,
      fee,
      baseAmount,
      shippingAmount,
    };
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gateway Tax Hub</h1>
          <p className="text-gray-600">
            Calculadora de taxas e parcelamentos para gateways de pagamento
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configurações */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Configure o cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Plataforma</label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger aria-label="Selecione a plataforma">
                      <SelectValue placeholder="Selecione a plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payt">Payt</SelectItem>
                      <SelectItem value="zicpay" disabled>
                        Zicpay (Em breve)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Valor do produto</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      R$
                    </span>
                    <Input
                      type="number"
                      className="pl-8"
                      placeholder="0,00"
                      value={amount !== null ? amount : ''}
                      onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : null)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Switch
                        id="shipping-toggle"
                        checked={includeShipping}
                        onCheckedChange={handleShippingToggle}
                      />
                      <div>
                        <label htmlFor="shipping-toggle" className="text-sm font-medium">
                          Incluir frete
                        </label>
                        <p className="text-sm text-gray-500">
                          Adicionar valor do frete ao cálculo
                        </p>
                      </div>
                    </div>
                    {includeShipping && (
                      <div className="relative w-32">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          R$
                        </span>
                        <Input
                          type="number"
                          className="pl-8"
                          value={shippingCost !== null ? shippingCost : ''}
                          onChange={(e) =>
                            setShippingCost(e.target.value ? Number(e.target.value) : null)
                          }
                          placeholder="0,00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo dos valores */}
            {amount !== null && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Resumo dos valores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor do produto:</span>
                      <span className="font-medium">
                        {Number(amount).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                    {includeShipping && shippingCost !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor do frete:</span>
                        <span className="font-medium">
                          {Number(shippingCost).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </span>
                      </div>
                    )}
                    <div className="pt-2 border-t flex justify-between">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-medium text-blue-700">
                        {(
                          Number(amount) +
                          (includeShipping && shippingCost !== null ? Number(shippingCost) : 0)
                        ).toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tabela de Parcelamento */}
          {amount !== null && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Tabela de Parcelamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Parcelas</th>
                        <th className="text-left p-2">Taxa</th>
                        <th className="text-left p-2">Valor da Parcela</th>
                        <th className="text-left p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(paytFees).map(([installment, fee]) => {
                        const calculation = calculateInstallment(
                          amount,
                          Number(installment),
                          fee
                        );

                        return (
                          <tr key={installment} className="border-b hover:bg-gray-50">
                            <td className="p-2">{installment}x</td>
                            <td className="p-2 text-blue-800">{fee}%</td>
                            <td className="p-2">
                              {calculation.installmentValue.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </td>
                            <td className="p-2 font-medium">
                              {calculation.totalAmount.toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div>
        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 mt-8">
          Gateway Tax Hub &copy; {getCurrentYear()} | Desenvolvido por{' '}
          <a
            href="https://github.com/pecraveiro/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline cursor-pointer">
            @pecraveiro
          </a>
        </footer>
      </div>
    </div>
  );
};

export default PaymentCalculator;