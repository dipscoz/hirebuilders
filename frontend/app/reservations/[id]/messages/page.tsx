"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000";

type Message = {
  id: number;
  content: string;
  senderRole: string;
  createdAt: string;
  read: boolean;
  senderUser?: {
    firstName?: string;
    lastName?: string;
    role?: string;
  } | null;
};

type Reservation = {
  id: number;
  clientName: string;
  clientEmail?: string;
  status: string;

  employee: {
    id: number;
    name: string;
    job: string;
    city: string;
  };
};

export default function ClientMessagesPage() {
  const params = useParams();
  const router = useRouter();

  const reservationId =
    String(params?.id || "");

  const [reservation, setReservation] =
    useState<Reservation | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [content, setContent] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [error, setError] =
    useState("");

  async function loadConversation() {
    try {
      setLoading(true);
      setError("");

      const response =
        await fetch(
          `${API}/api/messages/reservation/${reservationId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (response.status === 401) {
        router.replace(
          "/connexion"
        );
        return;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible de charger la conversation."
        );
      }

      setReservation(
        data?.reservation || null
      );

      setMessages(
        Array.isArray(data?.messages)
          ? data.messages
          : []
      );

      await fetch(
        `${API}/api/messages/reservation/${reservationId}/read`,
        {
          method: "PUT",
          credentials: "include",
        }
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible de charger la conversation."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (reservationId) {
      loadConversation();
    }
  }, [reservationId]);

  async function sendMessage(
    event: FormEvent
  ) {
    event.preventDefault();

    const clean =
      content.trim();

    if (!clean) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response =
        await fetch(
          `${API}/api/messages/reservation/${reservationId}`,
          {
            method: "POST",
            credentials: "include",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              content: clean,
            }),
          }
        );

      const data =
        await response.json().catch(
          () => null
        );

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Impossible d'envoyer le message."
        );
      }

      if (data?.message) {
        setMessages(
          (current) => [
            ...current,
            data.message,
          ]
        );
      }

      setContent("");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'envoyer le message."
      );
    } finally {
      setSending(false);
    }
  }

  function formatDate(
    value: string
  ) {
    return new Date(
      value
    ).toLocaleString(
      "fr-FR",
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  return (
    <div className="page">

      <header className="navbar">
        <div className="navInner">

          <Link
            href="/"
            className="brand"
          >
            <div className="brandLogo">
              HB
            </div>

            <div>
              <div className="brandName">
                Hire<span>Builders</span>
              </div>

              <div className="brandSub">
                Messagerie sécurisée
              </div>
            </div>
          </Link>

          <Link
            href="/reservations"
            className="backButton"
          >
            ← Mes réservations
          </Link>

        </div>
      </header>


      <main className="content">

        {loading ? (
          <div className="state">
            <div className="spinner" />
            <h2>
              Chargement de la conversation
            </h2>
          </div>
        ) : error && !reservation ? (
          <div className="state errorState">
            <h2>
              Impossible d'ouvrir la conversation
            </h2>

            <p>
              {error}
            </p>

            <Link
              href="/reservations"
              className="primaryButton"
            >
              Retour aux réservations
            </Link>
          </div>
        ) : reservation ? (

          <>

            <section className="conversationHeader">

              <div>

                <div className="label">
                  DEMANDE #{reservation.id}
                </div>

                <h1>
                  Discussion avec
                  <span> HireBuilders</span>
                </h1>

                <p>
                  Votre demande concerne :
                  {" "}
                  <strong>
                    {reservation.employee.name}
                  </strong>
                  {" "}
                  — {reservation.employee.job}
                </p>

              </div>

              <div className="security">
                🔒
                Conversation privée
              </div>

            </section>


            {error && (
              <div className="errorBox">
                {error}
              </div>
            )}


            <section className="chatCard">

              <div className="chatNotice">
                <strong>
                  Vous échangez directement avec HireBuilders.
                </strong>

                <p>
                  Le numéro de téléphone de l'employé
                  n'est jamais affiché dans cette conversation.
                </p>
              </div>


              <div className="messages">

                {messages.length === 0 && (
                  <div className="emptyMessages">
                    <div>
                      💬
                    </div>

                    <h3>
                      Aucun message
                    </h3>

                    <p>
                      Écrivez-nous pour expliquer votre besoin
                      ou poser une question.
                    </p>
                  </div>
                )}


                {messages.map(
                  (message) => {
                    const isClient =
                      message.senderRole ===
                      "client";

                    return (
                      <div
                        key={message.id}
                        className={
                          isClient
                            ? "messageRow client"
                            : "messageRow admin"
                        }
                      >

                        <div className="messageBubble">

                          <div className="messageAuthor">
                            {isClient
                              ? "Vous"
                              : "HireBuilders"}
                          </div>

                          <p>
                            {message.content}
                          </p>

                          <small>
                            {formatDate(
                              message.createdAt
                            )}
                          </small>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>


              <form
                className="composer"
                onSubmit={sendMessage}
              >

                <textarea
                  value={content}
                  onChange={(event) =>
                    setContent(
                      event.target.value
                    )
                  }
                  placeholder="Écrivez votre message à HireBuilders..."
                  rows={4}
                  maxLength={3000}
                />

                <div className="composerBottom">

                  <span>
                    {content.length}/3000
                  </span>

                  <button
                    type="submit"
                    disabled={
                      sending ||
                      !content.trim()
                    }
                  >
                    {sending
                      ? "Envoi..."
                      : "Envoyer"}
                  </button>

                </div>

              </form>

            </section>

          </>
        ) : null}

      </main>

      <style jsx>{`

        .page {
          min-height: 100vh;

          background:
            radial-gradient(
              circle at top right,
              rgba(251,191,36,.08),
              transparent 28%
            ),
            linear-gradient(
              135deg,
              #050b16,
              #0b1322 55%,
              #101b2c
            );

          color: white;

          font-family:
            Inter,
            Arial,
            sans-serif;
        }

        .navbar {
          height: 82px;

          position: sticky;
          top: 0;
          z-index: 100;

          background:
            rgba(5,11,22,.95);

          border-bottom:
            1px solid
            rgba(255,255,255,.08);

          backdrop-filter:
            blur(16px);
        }

        .navInner {
          width:
            min(
              1050px,
              calc(100% - 40px)
            );

          height: 100%;

          margin: auto;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .brand {
          display: flex;

          align-items: center;

          gap: 11px;

          color: white;

          text-decoration: none;
        }

        .brandLogo {
          width: 45px;
          height: 45px;

          display: flex;

          align-items: center;
          justify-content: center;

          border-radius: 13px;

          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          font-size: 18px;

          font-weight: 900;
        }

        .brandName {
          font-size: 20px;

          font-weight: 900;
        }

        .brandName span {
          color: #fbbf24;
        }

        .brandSub {
          margin-top: 3px;

          color: #64748b;

          font-size: 8px;
        }

        .backButton {
          height: 38px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding:
            0
            12px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 9px;

          color: #cbd5e1;

          text-decoration: none;

          font-size: 9px;

          font-weight: 800;
        }

        .content {
          width:
            min(
              950px,
              calc(100% - 30px)
            );

          margin: auto;

          padding:
            40px
            0
            60px;
        }

        .conversationHeader {
          display: flex;

          align-items: flex-end;

          justify-content: space-between;

          gap: 20px;

          margin-bottom: 20px;
        }

        .label {
          color: #fbbf24;

          font-size: 8px;

          letter-spacing: 1.5px;

          font-weight: 900;
        }

        h1 {
          margin-top: 7px;

          font-size:
            clamp(
              30px,
              5vw,
              46px
            );

          line-height: 1;

          letter-spacing: -1.5px;

          font-weight: 900;
        }

        h1 span {
          color: #fbbf24;
        }

        .conversationHeader p {
          margin-top: 8px;

          color: #64748b;

          font-size: 10px;
        }

        .conversationHeader p strong {
          color: #cbd5e1;
        }

        .security {
          padding:
            8px
            10px;

          border:
            1px solid
            rgba(34,197,94,.12);

          border-radius: 999px;

          background:
            rgba(34,197,94,.04);

          color: #4ade80;

          font-size: 7px;

          font-weight: 900;

          white-space: nowrap;
        }

        .chatCard {
          border:
            1px solid
            rgba(255,255,255,.07);

          border-radius: 18px;

          background:
            linear-gradient(
              145deg,
              #111c2d,
              #0a1422
            );

          overflow: hidden;

          box-shadow:
            0 25px 60px
            rgba(0,0,0,.18);
        }

        .chatNotice {
          padding:
            13px
            16px;

          background:
            rgba(251,191,36,.035);

          border-bottom:
            1px solid
            rgba(255,255,255,.06);
        }

        .chatNotice strong {
          display: block;

          color: #fbbf24;

          font-size: 9px;
        }

        .chatNotice p {
          margin-top: 3px;

          color: #64748b;

          font-size: 8px;
        }

        .messages {
          min-height: 430px;

          max-height: 560px;

          overflow-y: auto;

          padding:
            20px;

          display: flex;

          flex-direction: column;

          gap: 12px;
        }

        .messageRow {
          display: flex;

          width: 100%;
        }

        .messageRow.client {
          justify-content: flex-end;
        }

        .messageRow.admin {
          justify-content: flex-start;
        }

        .messageBubble {
          max-width: min(
            70%,
            600px
          );

          padding:
            11px
            13px;

          border-radius: 14px;
        }

        .messageRow.client
        .messageBubble {
          background:
            linear-gradient(
              135deg,
              #fbbf24,
              #f59e0b
            );

          color: #111827;

          border-bottom-right-radius: 4px;
        }

        .messageRow.admin
        .messageBubble {
          background:
            rgba(255,255,255,.05);

          border:
            1px solid
            rgba(255,255,255,.07);

          color: #e2e8f0;

          border-bottom-left-radius: 4px;
        }

        .messageAuthor {
          font-size: 7px;

          font-weight: 900;

          opacity: .75;
        }

        .messageBubble p {
          margin-top: 5px;

          font-size: 10px;

          line-height: 1.6;

          white-space: pre-wrap;
        }

        .messageBubble small {
          display: block;

          margin-top: 7px;

          font-size: 6px;

          opacity: .6;
        }

        .composer {
          padding:
            14px
            16px;

          border-top:
            1px solid
            rgba(255,255,255,.07);

          background:
            rgba(5,11,22,.55);
        }

        .composer textarea {
          width: 100%;

          resize: vertical;

          min-height: 95px;

          padding: 12px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 11px;

          outline: none;

          background:
            #08111f;

          color: white;

          font-family: inherit;

          font-size: 10px;

          line-height: 1.6;
        }

        .composer textarea:focus {
          border-color:
            rgba(251,191,36,.45);

          box-shadow:
            0 0 0 3px
            rgba(251,191,36,.06);
        }

        .composer textarea::placeholder {
          color: #475569;
        }

        .composerBottom {
          margin-top: 8px;

          display: flex;

          align-items: center;

          justify-content: space-between;
        }

        .composerBottom span {
          color: #475569;

          font-size: 7px;
        }

        .composerBottom button {
          height: 39px;

          padding:
            0
            17px;

          border: none;

          border-radius: 9px;

          background:
            #fbbf24;

          color: #111827;

          font-size: 9px;

          font-weight: 900;

          cursor: pointer;
        }

        .composerBottom button:disabled {
          opacity: .5;

          cursor: not-allowed;
        }

        .errorBox {
          margin-bottom: 12px;

          padding: 10px;

          border:
            1px solid
            rgba(239,68,68,.12);

          border-radius: 9px;

          background:
            rgba(239,68,68,.04);

          color: #f87171;

          font-size: 8px;
        }

        .state {
          min-height: 400px;

          display: flex;

          flex-direction: column;

          align-items: center;

          justify-content: center;

          text-align: center;
        }

        .state h2 {
          margin-top: 14px;

          font-size: 18px;

          font-weight: 900;
        }

        .state p {
          margin-top: 7px;

          color: #64748b;

          font-size: 9px;
        }

        .spinner {
          width: 34px;
          height: 34px;

          border:
            3px solid
            rgba(255,255,255,.08);

          border-top-color:
            #fbbf24;

          border-radius: 50%;

          animation:
            spin
            1s
            linear
            infinite;
        }

        @keyframes spin {
          to {
            transform:
              rotate(360deg);
          }
        }

        .primaryButton {
          margin-top: 16px;

          height: 39px;

          display: flex;

          align-items: center;

          justify-content: center;

          padding:
            0
            13px;

          border-radius: 9px;

          background:
            #fbbf24;

          color: #111827;

          text-decoration: none;

          font-size: 8px;

          font-weight: 900;
        }

        @media (max-width: 650px) {
          .brandSub {
            display: none;
          }

          .brandName {
            font-size: 17px;
          }

          .brandLogo {
            width: 42px;
            height: 42px;
          }

          .conversationHeader {
            align-items:
              flex-start;

            flex-direction: column;
          }

          .security {
            align-self:
              flex-start;
          }

          .messages {
            min-height: 380px;

            padding: 14px;
          }

          .messageBubble {
            max-width: 88%;
          }

          .content {
            width:
              calc(100% - 25px);

            padding:
              25px
              0
              40px;
          }
        }

      `}</style>
    </div>
  );
}