PGDMP      )                |            c21db    16.4    16.4     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16450    c21db    DATABASE     |   CREATE DATABASE c21db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE c21db;
                postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            �           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            �            1259    16463    todos    TABLE     �   CREATE TABLE public.todos (
    id integer NOT NULL,
    title character varying(100) NOT NULL,
    complete boolean DEFAULT false,
    deadline timestamp without time zone DEFAULT (CURRENT_DATE + '1 day'::interval),
    userid integer NOT NULL
);
    DROP TABLE public.todos;
       public         heap    postgres    false    4            �            1259    16462    todos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.todos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.todos_id_seq;
       public          postgres    false    218    4            �           0    0    todos_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.todos_id_seq OWNED BY public.todos.id;
          public          postgres    false    217            �            1259    16452    users    TABLE     �   CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    avatar text
);
    DROP TABLE public.users;
       public         heap    postgres    false    4            �            1259    16451    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    216    4            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    215            V           2604    16466    todos id    DEFAULT     d   ALTER TABLE ONLY public.todos ALTER COLUMN id SET DEFAULT nextval('public.todos_id_seq'::regclass);
 7   ALTER TABLE public.todos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    218    218            U           2604    16455    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    215    216            �          0    16463    todos 
   TABLE DATA           F   COPY public.todos (id, title, complete, deadline, userid) FROM stdin;
    public          postgres    false    218   �       �          0    16452    users 
   TABLE DATA           <   COPY public.users (id, email, password, avatar) FROM stdin;
    public          postgres    false    216   �       �           0    0    todos_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.todos_id_seq', 1, false);
          public          postgres    false    217            �           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 1, false);
          public          postgres    false    215            ^           2606    16470    todos todos_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.todos DROP CONSTRAINT todos_pkey;
       public            postgres    false    218            Z           2606    16461    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public            postgres    false    216            \           2606    16459    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            _           2606    16471    todos fk_user    FK CONSTRAINT     k   ALTER TABLE ONLY public.todos
    ADD CONSTRAINT fk_user FOREIGN KEY (userid) REFERENCES public.users(id);
 7   ALTER TABLE ONLY public.todos DROP CONSTRAINT fk_user;
       public          postgres    false    4700    218    216            �      x������ � �      �      x������ � �     