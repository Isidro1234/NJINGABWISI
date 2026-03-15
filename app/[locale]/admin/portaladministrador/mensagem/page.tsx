"use client"
import LoadingAnim from '@/components/custom/LoadingAnim';
import { useStreamChatContext } from '@/context/streamChatContext';
import { useLogicState } from '@/states/useLogicState';
import { HStack, VStack, Text, Box, Input } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react'
import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Window } from 'stream-chat-react';
import { createChannel } from '@/logic/createChannel';
import Image from 'next/image';
import { decryptdata } from '@/logic/encryptdata';

interface Funcionario {
  nome: string
  photo: string
  municipio: string
  provincia: string
  numero_do_bilhete: string
}

// ── Avatar helper ─────────────────────────────────────────────────────────────
function Avatar({ photo, nome, size, index }: { photo: string, nome: string, size: number, index: number }) {
  return (
    <Box width={`${size}px`} height={`${size}px`} borderRadius={'full'} overflow={'hidden'} position={'relative'} flexShrink={0}>
      {photo ? (
        <Image src={photo} fill alt={nome} style={{ objectFit: 'cover' }} />
      ) : (
        <Box width={'100%'} height={'100%'} bg={`hsl(${(index * 47) % 360},55%,65%)`}
          display={'flex'} alignItems={'center'} justifyContent={'center'}>
          <Text fontSize={size * 0.35} fontWeight={700} color={'white'}>
            {nome?.charAt(0)?.toUpperCase()}
          </Text>
        </Box>
      )}
    </Box>
  )
}

export default function Mensagem() {
  const { client, pronto } = useStreamChatContext();
  const getfuncionarios = useLogicState((state: any) => state.getfuncionarios);

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [activeChannel, setActiveChannel] = useState<any>(null);
  const [activeFuncionario, setActiveFuncionario] = useState<Funcionario | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  // Mobile: 'list' | 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getfuncionarios().then((res: any) => {
      if (res) setFuncionarios(res);
    });
  }, []);

  if (!pronto) return <LoadingAnim />;

  const filtered = funcionarios.filter(f =>
    f.nome?.toLowerCase().includes(search.toLowerCase())
  );

  async function handleStartChat(funcionario: Funcionario) {
    if (!client?.userID) return;
    setLoading(true);
    try {
      const uip = localStorage.getItem('uip') || localStorage.getItem('uipadmin');
      const user = decryptdata(uip || '');
      const { channel } = await createChannel(client, user?.id?.slice(0,5), funcionario.numero_do_bilhete?.slice(0,5));
      setActiveChannel(channel);
      setActiveFuncionario(funcionario);
      setMobileView('chat'); // ← go to chat on mobile
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const Sidebar = (
    <VStack
      width={{ base: '100%', md: '300px', lg: '340px' }}
      height={'100%'}
      bg={'#ffffff'}
      borderRight={{ base: 'none', md: '1px solid #eef0f5' }}
      gap={0}
      flexShrink={0}
      overflow={'hidden'}
      // On mobile: show only when mobileView === 'list'
      display={{ base: mobileView === 'list' ? 'flex' : 'none', md: 'flex' }}
    >
      {/* ── Header ── */}
      <VStack padding={'18px 16px 10px'} alignItems={'flex-start'} gap={1}
        borderBottom={'1px solid #f0f2f7'} width={'100%'}>
        <Text fontSize={{ base: 20, md: 18 }} fontWeight={700} color={'#0f1b35'}
          letterSpacing={'-0.5px'} style={{ fontFamily: "'Sora', sans-serif" }}>
          Mensagens
        </Text>
        <Text fontSize={11} color={'#9ba3b8'} fontWeight={500}>
          {funcionarios.length} funcionários disponíveis
        </Text>
        {/* Search */}
        <Box marginTop={2} width={'100%'} display={'flex'} alignItems={'center'}
          bg={'#f4f6fb'} borderRadius={10} paddingX={3} gap={2} height={'38px'}>
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="#9ba3b8" strokeWidth="1.8" />
            <path d="M15 15l3 3" stroke="#9ba3b8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <Input border={'none'} bg={'transparent'} fontSize={13}
            placeholder={'Pesquisar funcionário...'}
            value={search} onChange={(e) => setSearch(e.target.value)}
            _focus={{ boxShadow: 'none' }} _placeholder={{ color: '#b0b8cc' }}
            height={'100%'} paddingX={0} />
        </Box>
      </VStack>

      {/* ── Quick access avatar strip ── */}
      <VStack padding={'12px 16px 10px'} alignItems={'flex-start'} gap={2}
        borderBottom={'1px solid #f0f2f7'} width={'100%'}>
        <Text fontSize={10} fontWeight={600} color={'#b0b8cc'}
          textTransform={'uppercase'} letterSpacing={'1px'}>
          Início Rápido
        </Text>
        <HStack ref={scrollRef} overflowX={'auto'} gap={3} paddingBottom={1} width={'100%'}
          style={{ scrollbarWidth: 'none' }}
          css={{ '&::-webkit-scrollbar': { display: 'none' } }}>
          {funcionarios.slice(0, 12).map((f, i) => (
            <VStack key={i} gap={1} cursor={'pointer'} flexShrink={0}
              onClick={() => handleStartChat(f)}
              opacity={loading ? 0.5 : 1}
              transition={'transform 0.15s'}
              _active={{ transform: 'scale(0.93)' }}
              _hover={{ transform: 'translateY(-3px)' }}>
              <Box position={'relative'} boxShadow={'0 2px 10px rgba(0,0,0,0.12)'}
                borderRadius={'full'} border={'2.5px solid white'}>
                <Avatar photo={f.photo} nome={f.nome} size={44} index={i} />
                {/* Active indicator */}
                {activeFuncionario?.numero_do_bilhete === f.numero_do_bilhete && (
                  <Box position={'absolute'} bottom={0} right={0} width={'12px'} height={'12px'}
                    borderRadius={'full'} bg={'#3b5bdb'} border={'2px solid white'} />
                )}
              </Box>
              <Text fontSize={9} color={'#6b7280'} fontWeight={500}
                maxWidth={'44px'} textAlign={'center'} >
                {f.nome?.split(' ')[0]}
              </Text>
            </VStack>
          ))}
        </HStack>
      </VStack>

      {/* ── Full employee list ── */}
      <VStack flex={1} overflowY={'auto'} gap={0} alignItems={'stretch'} paddingY={1}
        css={{
          '&::-webkit-scrollbar': { width: '3px' },
          '&::-webkit-scrollbar-thumb': { background: '#e8eaf0', borderRadius: '4px' }
        }}>
        {filtered.length === 0 && (
          <Text fontSize={12} color={'#b0b8cc'} textAlign={'center'} paddingTop={10}>
            Nenhum funcionário encontrado
          </Text>
        )}
        {filtered.map((f, i) => {
          const isActive = activeFuncionario?.numero_do_bilhete === f.numero_do_bilhete;
          return (
            <HStack key={i}
              padding={{ base: '12px 16px', md: '10px 16px' }}
              cursor={'pointer'} gap={3}
              bg={isActive ? '#f0f4ff' : 'transparent'}
              borderLeft={isActive ? '3px solid #3b5bdb' : '3px solid transparent'}
              transition={'background 0.12s'}
              _hover={{ bg: '#f7f8fc' }}
              onClick={() => handleStartChat(f)}
              opacity={loading ? 0.6 : 1}
              minHeight={{ base: '64px', md: 'auto' }}
            >
              <Box position={'relative'} flexShrink={0}
                boxShadow={'0 1px 6px rgba(0,0,0,0.10)'} borderRadius={'full'}>
                <Avatar photo={f.photo} nome={f.nome} size={44} index={i} />
                <Box position={'absolute'} bottom={'1px'} right={'1px'}
                  width={'10px'} height={'10px'} borderRadius={'full'}
                  bg={'#22c55e'} border={'1.5px solid white'} />
              </Box>
              <VStack gap={0} alignItems={'flex-start'} flex={1} overflow={'hidden'}>
                <Text fontSize={{ base: 14, md: 13 }} fontWeight={600}
                  color={'#0f1b35'}>
                  {f.nome}
                </Text>
                <Text fontSize={11} color={'#9ba3b8'} >
                  {f.municipio}, {f.provincia}
                </Text>
              </VStack>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
                <path d="M7 5l5 5-5 5" stroke={isActive ? '#3b5bdb' : '#d1d5e0'}
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </HStack>
          )
        })}
      </VStack>
    </VStack>
  )

  // ── Chat panel ────────────────────────────────────────────────────────────
  const ChatPanel = (
    <VStack flex={1} height={'100%'} gap={0} overflow={'hidden'} bg={'#f7f8fc'}
      display={{ base: mobileView === 'chat' ? 'flex' : 'none', md: 'flex' }}>

      {activeChannel ? (
        <Channel channel={activeChannel}>
          <Window>
            {/* Custom chat header */}
            <HStack padding={{ base: '10px 14px', md: '12px 20px' }}
              bg={'white'} borderBottom={'1px solid #eef0f5'}
              gap={3} boxShadow={'0 1px 4px rgba(0,0,0,0.04)'}
              minHeight={{ base: '60px', md: 'auto' }}>

              {/* Back arrow — mobile only */}
              <Box display={{ base: 'flex', md: 'none' }}
                cursor={'pointer'} padding={1} flexShrink={0}
                onClick={() => setMobileView('list')}
                width={'32px'} height={'32px'} alignItems={'center'} justifyContent={'center'}
                borderRadius={'full'} _active={{ bg: '#f0f2f7' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13 4l-6 6 6 6" stroke="#0f1b35" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Box>

              {activeFuncionario ? (
                <>
                  <Box position={'relative'} flexShrink={0} borderRadius={'full'}
                    boxShadow={'0 1px 6px rgba(0,0,0,0.10)'}>
                    <Avatar photo={activeFuncionario.photo} nome={activeFuncionario.nome} size={38} index={0} />
                    <Box position={'absolute'} bottom={'1px'} right={'1px'}
                      width={'9px'} height={'9px'} borderRadius={'full'}
                      bg={'#22c55e'} border={'1.5px solid white'} />
                  </Box>
                  <VStack gap={0} alignItems={'flex-start'} flex={1} overflow={'hidden'}>
                    <Text fontSize={{ base: 15, md: 14 }} fontWeight={700}
                      color={'#0f1b35'} >
                      {activeFuncionario.nome}
                    </Text>
                    <HStack gap={1}>
                      <Box width={'6px'} height={'6px'} borderRadius={'full'} bg={'#22c55e'} />
                      <Text fontSize={11} color={'#9ba3b8'}>Online</Text>
                    </HStack>
                  </VStack>
                </>
              ) : <ChannelHeader />}
            </HStack>

            <Box flex={1} overflow={'hidden'} display={'flex'} flexDirection={'column'}>
              <MessageList />
              <MessageInput />
            </Box>
          </Window>
        </Channel>
      ) : (
        /* ── Empty state (desktop only — on mobile user stays on list) ── */
        <VStack flex={1} alignItems={'center'} justifyContent={'center'}
          gap={5} padding={{ base: 6, md: 10 }}
          display={{ base: 'none', md: 'flex' }}>
          <Box width={'68px'} height={'68px'} borderRadius={'full'} bg={'#eef1ff'}
            display={'flex'} alignItems={'center'} justifyContent={'center'}
            boxShadow={'0 4px 20px rgba(59,91,219,0.15)'}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                stroke="#3b5bdb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Box>
          <VStack gap={1}>
            <Text fontSize={16} fontWeight={700} color={'#0f1b35'} letterSpacing={'-0.3px'}>
              Nenhuma conversa activa
            </Text>
            <Text fontSize={12} color={'#9ba3b8'} textAlign={'center'} maxWidth={'220px'}>
              Seleccione um funcionário para iniciar uma conversa
            </Text>
          </VStack>
          {/* Stacked avatars */}
          <HStack gap={0} marginTop={1}>
            {funcionarios.slice(0, 5).map((f, i) => (
              <Box key={i} cursor={'pointer'} onClick={() => handleStartChat(f)}
                transition={'transform 0.15s'} _hover={{ transform: 'translateY(-4px)' }}
                zIndex={5 - i} marginLeft={i > 0 ? '-10px' : '0'}
                borderRadius={'full'} border={'2.5px solid white'}
                boxShadow={'0 2px 8px rgba(0,0,0,0.12)'}>
                <Avatar photo={f.photo} nome={f.nome} size={38} index={i} />
              </Box>
            ))}
            {funcionarios.length > 5 && (
              <Box width={'38px'} height={'38px'} borderRadius={'full'}
                bg={'#eef1ff'} border={'2.5px solid white'} marginLeft={'-10px'}
                display={'flex'} alignItems={'center'} justifyContent={'center'}>
                <Text fontSize={10} fontWeight={700} color={'#3b5bdb'}>
                  +{funcionarios.length - 5}
                </Text>
              </Box>
            )}
          </HStack>
        </VStack>
      )}
    </VStack>
  )

  return (
    <Chat client={client}>
      <Box
        width={'100%'}
        height={{ base: 'calc(100dvh - 110px)', md: 'calc(100vh - 120px)' }}
        borderRadius={{ base: 0, md: 16 }}
        overflow={'hidden'}
        boxShadow={{ base: 'none', md: '0 8px 40px rgba(0,0,0,0.10)' }}
        bg={'#f7f8fc'}
        display={'flex'}
        flexDirection={'row'}
      >
        {Sidebar}
        {ChatPanel}
      </Box>
    </Chat>
  )
}
