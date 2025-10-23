import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#823a80] via-[#c43c8b] to-[#e91e63] p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/register"
            className="inline-flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Cadastro
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Política de Privacidade</h1>
          <p className="text-white/80">GioFlux - Sistema de Gestão para Consultoras</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5" />
              Termos de Uso e Política de Privacidade
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-gray-700">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Introdução</h2>
              <p className="mb-3">
                Bem-vindo ao GioFlux, um sistema de gestão desenvolvido especificamente para consultoras de beleza e estética.
                Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais
                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Dados Coletados</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-[#823a80] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Dados de Cadastro</h3>
                    <p className="text-sm text-gray-600">Nome completo, endereço de email e senha criptografada.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Eye className="w-5 h-5 text-[#823a80] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Dados de Clientes</h3>
                    <p className="text-sm text-gray-600">Informações dos clientes atendidos (nome, contato, histórico de serviços).</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-[#823a80] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Dados Operacionais</h3>
                    <p className="text-sm text-gray-600">Agendamentos, tratamentos realizados, registros financeiros.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Finalidade do Tratamento</h2>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Fornecer e manter o sistema de gestão para consultoras</li>
                <li>Gerenciar agendamentos e atendimentos</li>
                <li>Manter registros financeiros e operacionais</li>
                <li>Garantir a segurança e integridade dos dados</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Compartilhamento de Dados</h2>
              <p className="mb-3">
                Seus dados são tratados com absoluta confidencialidade. Não compartilhamos suas informações pessoais
                com terceiros, exceto quando:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Autorizado por você</li>
                <li>Exigido por lei ou ordem judicial</li>
                <li>Necessário para prestação do serviço (provedores de infraestrutura)</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Segurança dos Dados</h2>
              <p className="mb-3">
                Implementamos medidas técnicas e organizacionais avançadas para proteger seus dados:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Criptografia de dados em trânsito e repouso</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e seguros</li>
                <li>Auditorias de segurança periódicas</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Seus Direitos (LGPD)</h2>
              <p className="mb-3">Você possui os seguintes direitos sobre seus dados pessoais:</p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li><strong>Confirmação:</strong> Saber se tratamos seus dados</li>
                <li><strong>Acesso:</strong> Obter cópia dos dados tratados</li>
                <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
                <li><strong>Anonimização:</strong> Solicitar anonimização dos dados</li>
                <li><strong>Portabilidade:</strong> Solicitar transferência dos dados</li>
                <li><strong>Exclusão:</strong> Solicitar exclusão dos dados (quando aplicável)</li>
                <li><strong>Revogação:</strong> Revogar consentimento a qualquer momento</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Retenção de Dados</h2>
              <p className="text-sm">
                Mantemos seus dados apenas pelo tempo necessário para cumprir as finalidades descritas,
                respeitando prazos legais de retenção. Dados de clientes são mantidos conforme
                regulamentações do setor de saúde e estética.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Cookies e Tecnologias</h2>
              <p className="text-sm">
                Utilizamos cookies essenciais para o funcionamento do sistema e melhoria da experiência do usuário.
                Não utilizamos cookies para rastreamento ou publicidade.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contato</h2>
              <p className="text-sm mb-2">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium">Email: privacidade@gioflux.com</p>
                <p className="text-sm">Resposta em até 15 dias úteis</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Atualizações</h2>
              <p className="text-sm">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas
                através do sistema ou por email. O uso continuado do serviço após atualizações constitui
                aceitação dos novos termos.
              </p>
            </div>

            <div className="border-t pt-6">
              <p className="text-xs text-gray-500 text-center">
                Última atualização: {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link to="/register">
            <Button className="bg-gradient-to-r from-[#823a80] to-[#c43c8b] hover:opacity-90">
              Voltar ao Cadastro
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
